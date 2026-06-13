// Deep Focus — tetikleme & yükleme relay'i (Cloudflare Worker)
// Görev: dashboard'dan gelen istekle GitHub Actions'ı (daily.yml) tetikler,
// opsiyonel referans klibi R2'ye yükleyip runner'ın erişebileceği URL döner.
//
// Gerekli bağlamalar (Cloudflare panelinden):
//   Secret : GH_PAT      → fine-grained PAT (repo: pomodoro-video, Actions: Read+Write)
//   Secret : APP_PIN     → dashboard'a gireceğin gizli PIN
//   Var    : REPO        → "admlyz5858/pomodoro-video"
//   Var    : ALLOW_ORIGIN→ "https://admlyz5858.github.io"
//   R2     : CLIPS       → bir R2 bucket (örn "df-clips") bu isimle bağlanır

const cors = (o) => ({
  "Access-Control-Allow-Origin": o || "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,X-Pin,X-Filename",
  "Access-Control-Max-Age": "86400",
});
const json = (obj, status, o) =>
  new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json", ...cors(o) } });

const UPLOAD_LIMIT = 60 * 1024 * 1024; // 60 MB

export default {
  async fetch(req, env) {
    const o = env.ALLOW_ORIGIN || "*";
    const url = new URL(req.url);

    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(o) });

    // Yüklenen klibi sun (runner buradan indirir)
    if (req.method === "GET" && url.pathname.startsWith("/clip/")) {
      const key = decodeURIComponent(url.pathname.slice(6));
      const obj = await env.CLIPS.get(key);
      if (!obj) return new Response("not found", { status: 404 });
      return new Response(obj.body, {
        headers: { "Content-Type": obj.httpMetadata?.contentType || "video/mp4", "Cache-Control": "public,max-age=86400" },
      });
    }

    if (url.pathname === "/" || url.pathname === "/health")
      return json({ ok: true, service: "deepfocus-relay" }, 200, o);

    // PIN kapısı (değiştiren istekler)
    if ((env.APP_PIN || "") && req.headers.get("X-Pin") !== env.APP_PIN)
      return json({ error: "unauthorized" }, 401, o);

    // Referans klip yükle → R2 → URL
    if (req.method === "POST" && url.pathname === "/upload") {
      const cl = Number(req.headers.get("Content-Length") || 0);
      if (cl > UPLOAD_LIMIT) return json({ error: "too_large", limit_mb: 60 }, 413, o);
      const name = (req.headers.get("X-Filename") || "clip.mp4").replace(/[^a-zA-Z0-9._-]/g, "_");
      const key = `clips/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${name}`;
      await env.CLIPS.put(key, req.body, {
        httpMetadata: { contentType: req.headers.get("Content-Type") || "video/mp4" },
      });
      return json({ url: `${url.origin}/clip/${encodeURIComponent(key)}` }, 200, o);
    }

    // Üretimi tetikle
    if (req.method === "POST" && url.pathname === "/generate") {
      let body;
      try { body = await req.json(); } catch { return json({ error: "bad_json" }, 400, o); }
      const inp = body.inputs || {};
      const clean = {};
      for (const k of ["force_url", "focus", "brk", "kind", "emoji", "query", "ambient", "accent", "clock_pos", "clock_style"])
        if (inp[k] != null && inp[k] !== "") clean[k] = String(inp[k]);
      const r = await fetch(`https://api.github.com/repos/${env.REPO}/actions/workflows/daily.yml/dispatches`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.GH_PAT}`,
          Accept: "application/vnd.github+json",
          "User-Agent": "deepfocus-relay",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ref: "main", inputs: clean }),
      });
      if (r.status === 204) return json({ ok: true, inputs: clean }, 200, o);
      return json({ error: "dispatch_failed", status: r.status, detail: (await r.text()).slice(0, 300) }, 502, o);
    }

    return json({ error: "not_found" }, 404, o);
  },
};
