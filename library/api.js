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

// menyimpan data user
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

  // agar server tahu siapa user yang melakukan request
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const init = {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };

  async function ambil(url) {
    const r = await fetch(url, init);
    let d = null;
    try {
      d = await r.json();
    } catch {
      d = null;
    }
    return { res: r, data: d };
  }

  const STATUS_DIBLOKIR = [403, 404, 405];

  // mengirim request ke API
  let hasil;
  try {
    hasil = await ambil(`${API_BASE}/${PROJECT}${path}`);
  } catch {
    hasil = null;
  }

  const perluFallback =
    !hasil || (["PUT", "DELETE"].includes(method) && STATUS_DIBLOKIR.includes(hasil.res.status));

  if (perluFallback) {
    try {
      hasil = await ambil(`/api/proxy/${PROJECT}${path}`); //proxy lokal
    } catch {
      if (!hasil) {
        throw new Error("Tidak bisa menghubungi server API. Periksa koneksi internet kamu.");
      }
    }
  }

  const { res, data } = hasil;

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

    update: async (id, body) => {
      try {
        return await request(`/${resource}/${id}`, { method: "PUT", body });
      } catch (err) {
        if ([403, 404, 405].includes(err.status)) {
          try {
            return await request(`/${resource}/${id}`, { method: "PATCH", body });
          } catch {
            throw err;
          }
        }
        throw err;
      }
    },
    remove: (id) => request(`/${resource}/${id}`, { method: "DELETE" }),
  };
}

export async function apiRegister({ nama, email, password }) {
  return request("/register", { method: "POST", body: { nama, email, password }, auth: false });
}

export async function apiLogin({ email, password }) {
  const data = await request("/login", { method: "POST", body: { email, password }, auth: false });
  if (data?.token) setToken(data.token);

  const rawUser =
    data?.user ??
    data?.data?.user ??
    data?.data ??
    (data?.id || data?.email ? data : null);

  const rawRole =
    rawUser?.role ??
    rawUser?.tipe_user ??
    rawUser?.role_name ??
    (Array.isArray(rawUser?.roles) ? rawUser.roles[0] : undefined);

  if (!rawUser || rawRole === undefined) {
    console.error("Bentuk response login tidak dikenali:", JSON.stringify(data, null, 2));
    throw new Error(
      "Login berhasil tapi data user/role tidak ditemukan di response API. Cek console untuk bentuk response aslinya."
    );
  }

  const user = {
    id: rawUser.id,
    nama: rawUser.name || rawUser.nama,
    email: rawUser.email,
    role: rawRole === "penyewa" ? "user" : rawRole,
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

// ---------- Resources ----------
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

// ---------- Status enum ----------
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