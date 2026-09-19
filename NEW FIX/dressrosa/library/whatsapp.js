import { formatRupiah, formatTanggal, statusLabel } from "./utils";

export const WA_ADMIN = process.env.NEXT_PUBLIC_WA_ADMIN || "6281234567890";

export function normalisasiNomor(nomor) {
  let n = String(nomor || "").replace(/\D/g, "");
  if (n.startsWith("0")) n = "62" + n.slice(1);
  else if (n.startsWith("8")) n = "62" + n;
  return n;
}

export function linkWA(nomor, pesan) {
  const n = normalisasiNomor(nomor);
  if (!n) return "";
  return `https://wa.me/${n}?text=${encodeURIComponent(pesan || "")}`;
}

function daftarItem(p) {
  if (!p.items?.length) return "-";
  return p.items.map((i) => `- ${i.nama} x${i.qty}`).join("\n");
}

// Penyewa -> Admin
export function pesanKeAdmin(p, namaUser) {
  return [
    "Halo Admin EVENTRA,",
    `Saya ${namaUser || "penyewa"} ingin menanyakan pengajuan peminjaman berikut:`,
    "",
    `Kode: ${p.kodePesanan || `#${p.id}`}`,
    `Barang:\n${daftarItem(p)}`,
    `Tanggal: ${formatTanggal(p.tanggalMulai)} - ${formatTanggal(p.tanggalSelesai)}`,
    `Total: ${formatRupiah(p.totalBayar)}`,
    `Status: ${statusLabel[p.status] || p.status}`,
    "",
    "Terima kasih.",
  ].join("\n");
}

// Admin -> Penyewa
export function pesanKeUser(p, namaUser) {
  return [
    `Halo ${namaUser || "Kak"}, ini Admin EVENTRA.`,
    `Pengajuan peminjaman ${p.kodePesanan || `#${p.id}`} kamu saat ini berstatus: *${statusLabel[p.status] || p.status}*.`,
    "",
    `Barang:\n${daftarItem(p)}`,
    `Tanggal: ${formatTanggal(p.tanggalMulai)} - ${formatTanggal(p.tanggalSelesai)}`,
    `Total: ${formatRupiah(p.totalBayar)}`,
    p.status === "disetujui" ? "\nSilakan lanjutkan pembayaran melalui halaman Status di website." : "",
    "",
    "Terima kasih.",
  ].join("\n");
}