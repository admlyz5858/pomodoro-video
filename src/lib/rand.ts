// Deterministik sözde-rastgele [0,1) — indekse göre sabit, her render aynı sonucu verir.
export const rand = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// İkinci bağımsız seri (farklı eksenler için)
export const rand2 = (seed: number): number => {
  const x = Math.sin(seed * 269.5 + 183.3) * 24634.6345;
  return x - Math.floor(x);
};
