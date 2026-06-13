# Deep Focus relay — Cloudflare kurulumu (~10 dk, tek seferlik)

Dashboard'daki "Üret" butonlarının çalışması için bu küçük relay gerekiyor.
Token bulutta gizli kalır; dashboard sadece relay URL + PIN bilir.

## 1) GitHub fine-grained token (dar yetkili)
- github.com → Settings → Developer settings → **Fine-grained tokens** → Generate new
- Repository access: **Only select repositories** → `pomodoro-video`
- Permissions → Repository → **Actions: Read and write** (+ Metadata: Read otomatik)
- Token'ı kopyala (bir daha gösterilmez).

## 2) Cloudflare hesabı + Worker
- dash.cloudflare.com → ücretsiz hesap
- **Workers & Pages → Create → Worker** → adı `deepfocus-relay` → Deploy
- **Edit code** → `cloudflare/worker.js` içeriğini yapıştır → Deploy

## 3) R2 bucket (referans dosya yükleme için)
- **R2 → Create bucket** → ad: `df-clips` → Create
- Worker → **Settings → Bindings → Add → R2 bucket**
  - Variable name: `CLIPS`  ·  Bucket: `df-clips`

## 4) Worker değişkenleri (Settings → Variables and Secrets)
- **Secret** `GH_PAT`  = (1. adımdaki token)
- **Secret** `APP_PIN` = kendi belirlediğin gizli PIN (örn 6 haneli)
- **Text**   `REPO`        = `admlyz5858/pomodoro-video`
- **Text**   `ALLOW_ORIGIN`= `https://admlyz5858.github.io`
- Deploy.

## 5) Dashboard'a bağla
- Worker URL'in: `https://deepfocus-relay.<hesabın>.workers.dev`
- Dashboard'da sağ üstteki ⚙ → **Relay URL** ve **PIN**'i gir → Kaydet.
- Artık "✨ Sen karar ver" ve "🎛 Özelleştir" butonları çalışır.

## Test
- `https://deepfocus-relay.<hesabın>.workers.dev/health` → `{"ok":true}` görmelisin.
