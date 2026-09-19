import { dataAlat } from "./dataAlat";

const fotoById = Object.fromEntries(dataAlat.map((d) => [d.id, d.foto]));

const ATURAN_FOTO = [
  [/sound|audio|speaker|pengeras|mic\b|microphone/i, "2"],
  [/meja/i, "3"],
  [/kursi|chair|tiffany/i, "7"],
  [/balon|balloon/i, "6"],
  [/string/i, "1"],
  [/lampu|light/i, "4"],
  [/dekor|bunga|drapery|pelaminan|backdrop/i, "5"],
];

const ATURAN_IKON = [
  [/tenda|tent|canopy|tarub/i, "⛺"],
  [/sound|audio|speaker|pengeras|mic/i, "🔊"],
  [/meja|table/i, "🍽️"],
  [/kursi|chair|sofa/i, "🪑"],
  [/lampu|light/i, "💡"],
  [/balon|balloon/i, "🎈"],
  [/dekor|bunga|drapery|pelaminan|backdrop|panggung|stage/i, "🎀"],
  [/proyektor|projector|layar|screen/i, "📽️"],
  [/genset|listrik|kabel|generator/i, "🔌"],
  [/piring|gelas|sendok|catering|makan|food/i, "🍴"],
  [/kipas|fan|\bac\b/i, "🌀"],
];

function cari(aturan, teks) {
  for (const [regex, hasil] of aturan) if (regex.test(teks)) return hasil;
  return null;
}

function escapeXml(t) {
  return String(t).replace(/[<>&"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" }[c]));
}

function placeholderSvg(ikon, nama) {
  const label = escapeXml(String(nama || "").slice(0, 34));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#dbeafe"/><stop offset="1" stop-color="#e0e7ff"/></linearGradient></defs><rect width="600" height="400" fill="url(#g)"/><text x="300" y="220" font-size="120" text-anchor="middle">${ikon}</text><text x="300" y="320" font-size="24" font-family="Arial,sans-serif" font-weight="bold" fill="#475569" text-anchor="middle">${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function resolveFotoBarang({ foto, nama, kategori }) {
  const fotoValid = foto && !/picsum\.photos/i.test(foto);
  if (fotoValid) return foto;

  const idFoto = cari(ATURAN_FOTO, nama || "") || cari(ATURAN_FOTO, kategori || "");
  if (idFoto && fotoById[idFoto]) return fotoById[idFoto];

  const ikon = cari(ATURAN_IKON, `${nama || ""} ${kategori || ""}`) || "📦";
  return placeholderSvg(ikon, nama);
}
