export function formatRupiah(angka) {
  const n = Number(angka) || 0;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);
}

export function formatTanggal(tanggal) {
  if (!tanggal) return "-";
  const d = new Date(tanggal);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

export function daysBetween(mulai, selesai) {
  if (!mulai || !selesai) return 0;

  const toUtcDay = (value) => {
    const match = String(value).slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return NaN;
    return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  };

  const a = toUtcDay(mulai);
  const b = toUtcDay(selesai);
  if (!Number.isFinite(a) || !Number.isFinite(b) || b < a) return 0;

  return Math.floor((b - a) / 86400000) + 1;
}

export const statusLabel = {
  menunggu_persetujuan: "Menunggu Persetujuan",
  disetujui: "Disetujui",
  ditolak: "Ditolak",
  siap_diambil: "Siap Diambil",
  sedang_dipinjam: "Sedang Dipinjam",
  terlambat: "Terlambat",
  dikembalikan: "Dikembalikan",
  diperiksa: "Diperiksa",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

export function statusClass(status) {
  const map = {
    menunggu_persetujuan: "bg-amber-100 text-amber-700",
    disetujui: "bg-blue-100 text-blue-700",
    ditolak: "bg-red-100 text-red-700",
    siap_diambil: "bg-indigo-100 text-indigo-700",
    sedang_dipinjam: "bg-purple-100 text-purple-700",
    terlambat: "bg-orange-100 text-orange-700",
    dikembalikan: "bg-cyan-100 text-cyan-700",
    diperiksa: "bg-sky-100 text-sky-700",
    selesai: "bg-emerald-100 text-emerald-700",
    dibatalkan: "bg-slate-200 text-slate-600",
  };
  return map[status] || "bg-slate-100 text-slate-600";
}

export const statusPembayaranLabel = {
  menunggu_konfirmasi: "Menunggu Konfirmasi",
  lunas: "Lunas",
  gagal: "Gagal",
};

const ALIAS_STATUS = {
  pending: "menunggu_persetujuan",
  menunggu: "menunggu_persetujuan",
  approved: "disetujui",
  rejected: "ditolak",
  cancelled: "dibatalkan",
  canceled: "dibatalkan",
  diproses: "disetujui",
  siap_dikirim: "siap_diambil",
  sedang_di_sewa: "sedang_dipinjam",
  sedang_disewa: "sedang_dipinjam",
  completed: "selesai",
};

export function normalizeStatus(status) {
  const key = String(status ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  if (!key) return "menunggu_persetujuan";
  if (statusLabel[key]) return key;
  return ALIAS_STATUS[key] || "menunggu_persetujuan";
}


export function labelStatusPeminjaman(p) {
  if (p?.status === "disetujui" && p?.sudahBayar) return "Menunggu Verifikasi Pembayaran";
  return statusLabel[p?.status] || p?.status || "-";
}