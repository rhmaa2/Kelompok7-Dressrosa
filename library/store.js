"use client";
import { dataAlat } from "./dataAlat";

const KEYS = {
  BARANG: "eventra_barang",
  USERS: "eventra_users",
  PENGAJUAN: "eventra_pengajuan",
  CURRENT_USER: "eventra_current_user",
};

function read(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function write(key, value) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function seedBarangAwal() {
  return dataAlat.map((b) => ({
    id: b.id,
    nama: b.nama_barang,
    kategori: b.kategori,
    gambar: b.foto,          // <- pakai URL foto asli
    deskripsi: b.deskripsi,
    ciriCiri: b.ciri_ciri,   // <- ikut dibawa, siapa tau mau ditampilkan
    hargaSewa: b.harga_sewa_per_hari,
    jaminan: b.harga_jaminan,
    stok: b.stok_tersedia,
    kondisi: b.kondisi,
  }));
}

const USER_AWAL = [
  { id: 1, nama: "Admin Eventra", email: "admin@eventra.test", password: "admin123", role: "admin", alamat: "Mataram, NTB", noHp: "081234567890", statusPetugas: "none" },
  { id: 2, nama: "Budi Petugas", email: "petugas@eventra.test", password: "petugas123", role: "petugas", alamat: "Mataram, NTB", noHp: "081234567891", statusPetugas: "approved" },
  { id: 3, nama: "Budi Penyewa", email: "budi@eventra.test", password: "user123", role: "user", alamat: "Mataram, NTB", noHp: "081234567892", statusPetugas: "none" },
];

export function seedStore() {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(KEYS.BARANG)) write(KEYS.BARANG, seedBarangAwal());
  if (!localStorage.getItem(KEYS.USERS)) write(KEYS.USERS, USER_AWAL);
  if (!localStorage.getItem(KEYS.PENGAJUAN)) write(KEYS.PENGAJUAN, []);
}

export function getBarang() { seedStore(); return read(KEYS.BARANG, seedBarangAwal()); }
export function saveBarang(items) { write(KEYS.BARANG, items); }

export function getUsers() { seedStore(); return read(KEYS.USERS, USER_AWAL); }
export function saveUsers(users) { write(KEYS.USERS, users); }

export function getPengajuan() { seedStore(); return read(KEYS.PENGAJUAN, []); }
export function savePengajuan(list) { write(KEYS.PENGAJUAN, list); }

export function getCurrentUser() { return read(KEYS.CURRENT_USER, null); }
export function setCurrentUser(user) { write(KEYS.CURRENT_USER, user); }
export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEYS.CURRENT_USER);
}

// Alur pengajuan menjadi petugas: user mengajukan diri, admin yang menyetujui.
// Tidak ada jalur pendaftaran langsung sebagai petugas.
export function ajukanJadiPetugas(userId, data = {}) {
  const { alasan = "", pengalaman = "", noHpPetugas = "" } = data;

  const users = getUsers().map((u) =>
    u.id === userId
      ? {
          ...u,
          statusPetugas: "pending",
          pengajuanPetugas: { alasan, pengalaman, noHpPetugas },
        }
      : u
  );
  saveUsers(users);

  const current = getCurrentUser();
  if (current && current.id === userId) {
    setCurrentUser({ ...current, statusPetugas: "pending" });
  }
  return users.find((u) => u.id === userId);
}

export function setujuiPetugas(userId) {
  const users = getUsers().map((u) =>
    u.id === userId ? { ...u, role: "petugas", statusPetugas: "approved" } : u
  );
  saveUsers(users);

  const current = getCurrentUser();
  if (current && current.id === userId) {
    setCurrentUser({ ...current, role: "petugas", statusPetugas: "approved" });
  }
}

export function tolakPetugas(userId) {
  const users = getUsers().map((u) =>
    u.id === userId ? { ...u, statusPetugas: "rejected" } : u
  );
  saveUsers(users);

  const current = getCurrentUser();
  if (current && current.id === userId) {
    setCurrentUser({ ...current, statusPetugas: "rejected" });
  }
}