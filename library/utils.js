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
  const a = new Date(mulai);
  const b = new Date(selesai);
  const diff = Math.round((b - a) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff + 1 : 1;
}

export const statusLabel = {
  PENDING: "Menunggu Persetujuan",
  APPROVED: "Disetujui",
  REJECTED: "Ditolak",
  CANCELLED: "Dibatalkan",
  DIPROSES: "Diproses",
  SIAP_DIAMBIL: "Siap Diambil",
  SIAP_DIKIRIM: "Siap Dikirim",
  SEDANG_DI_SEWA: "Sedang Disewa",
  DIKEMBALIKAN: "Dikembalikan",
  COMPLETED: "Selesai",
};

export function statusClass(status) {
  const map = {
    PENDING: "bg-amber-100 text-amber-700",
    APPROVED: "bg-blue-100 text-blue-700",
    REJECTED: "bg-red-100 text-red-700",
    CANCELLED: "bg-slate-200 text-slate-600",
    DIPROSES: "bg-blue-100 text-blue-700",
    SIAP_DIAMBIL: "bg-indigo-100 text-indigo-700",
    SIAP_DIKIRIM: "bg-indigo-100 text-indigo-700",
    SEDANG_DI_SEWA: "bg-purple-100 text-purple-700",
    DIKEMBALIKAN: "bg-cyan-100 text-cyan-700",
    COMPLETED: "bg-blue-100 text-blue-700",
  };
  return map[status] || "bg-slate-100 text-slate-600";
}