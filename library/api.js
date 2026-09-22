"use client";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://hmif.if.unram.ac.id/api/v3";
const PROJECT = process.env.NEXT_PUBLIC_PROJECT_ID || "eventra";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "pk_eventra_9014305bda3d34e9";

const TOKEN_KEY = "eventra_token";
const USER_KEY = "eventra_current_user";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user) {
  if (typeof window === "undefined") return;
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

export function logout() {
  setToken(null);
  setCurrentUser(null);
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = {
    "Content-Type": "application/json",
    "X-API-Key": API_KEY,
  };

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const init = {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };


  let res;
  try {
    res = await fetch(`${API_BASE}/${PROJECT}${path}`, init);
  } catch {
    try {
      res = await fetch(`/api/proxy/${PROJECT}${path}`, init);
    } catch {
      throw new Error("Tidak bisa menghubungi server API. Periksa koneksi internet kamu.");
    }
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `Permintaan gagal (${res.status}) pada ${method} ${path}` +
        (res.status === 403 ? " — ditolak server API (bukan error kode)." : "");
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

function crud(resource) {
  return {
    list: () => request(`/${resource}`, { method: "GET" }),
    get: (id) => request(`/${resource}/${id}`, { method: "GET" }),
    create: (body) => request(`/${resource}`, { method: "POST", body }),
    update: (id, body) => request(`/${resource}/${id}`, { method: "PUT", body }),
    remove: (id) => request(`/${resource}/${id}`, { method: "DELETE" }),
  };
}

// ---------- Auth ----------
export async function apiRegister({ nama, email, password }) {
  return request("/register", { method: "POST", body: { nama, email, password }, auth: false });
}

export async function apiLogin({ email, password }) {
  const data = await request("/login", { method: "POST", body: { email, password }, auth: false });
  if (data?.token) setToken(data.token);

  const user = {
    id: data?.user?.id,
    nama: data?.user?.name || data?.user?.nama,
    email: data?.user?.email,
    role: data?.user?.role === "penyewa" ? "user" : data?.user?.role || "user",
  };
  setCurrentUser(user);
  return { ...data, user };
}

export async function apiMe() {
  return request("/me", { method: "GET" });
}

export async function apiGetKey() {
  return request("/key", { method: "GET" });
}


export const Users = crud("users");
export const KategoriBarang = crud("kategori_barang");
export const Barang = crud("barang");
export const Peminjaman = crud("peminjaman");
export const DetailPeminjaman = crud("detail_peminjaman");
export const KeranjangItem = crud("keranjang_item");
export const Pembayaran = crud("pembayaran");
export const PengecekanBarang = crud("pengecekan_barang");
export const PengajuanPetugas = crud("pengajuan_petugas");
export const RiwayatStatus = crud("riwayat_status");


export const STATUS_PEMINJAMAN = {
  MENUNGGU_PERSETUJUAN: "menunggu_persetujuan",
  DISETUJUI: "disetujui",
  DITOLAK: "ditolak",
  SIAP_DIAMBIL: "siap_diambil",
  SEDANG_DIPINJAM: "sedang_dipinjam",
  TERLAMBAT: "terlambat",
  DIKEMBALIKAN: "dikembalikan",
  DIPERIKSA: "diperiksa",
  SELESAI: "selesai",
  DIBATALKAN: "dibatalkan",
};