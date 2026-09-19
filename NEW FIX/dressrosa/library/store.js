"use client";
import {
  apiRegister,
  apiLogin,
  apiMe,
  getCurrentUser,
  setCurrentUser,
  logout as apiLogout,
  Users,
  KategoriBarang,
  Barang,
  Peminjaman,
  DetailPeminjaman,
  Pembayaran,
  PengecekanBarang,
  KeranjangItem,
  PengajuanPetugas,
  RiwayatStatus,
} from "./api";
import { daysBetween, normalizeStatus } from "./utils";
import { resolveFotoBarang } from "./foto";

export { getCurrentUser, setCurrentUser };

async function coba(varian) {
  let lastErr;
  for (const fn of varian) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      // 403/405 = method diblokir server; mencoba bentuk payload lain percuma.
      if (err.status === 403 || err.status === 405) break;
    }
  }
  throw lastErr || new Error("Permintaan ke API gagal.");
}

export function logout() {
  apiLogout();
}

// ---------- AUTH ----------
export async function registerUser({ nama, email, password, noHp }) {
  await apiRegister({ nama, email, password });
  const loginRes = await apiLogin({ email, password });

  if (noHp && loginRes?.user?.id) {
    try {
      await Users.update(loginRes.user.id, {
        nama,
        email,
        no_telepon: noHp,
        role: "penyewa",
      });
    } catch {
    }
  }

  return loginRes.user;
}

export async function loginUser({ email, password }) {
  const res = await apiLogin({ email, password });
  const user = res.user;

  if (user?.role === "user") {
    try {
      const terbaru = await pengajuanPetugasTerbaru();
      if (terbaru[String(user.id)]?.status === "approved") {
        user.role = "petugas";
        user.viaPengajuan = true;
        setCurrentUser(user);
      }
    } catch {
    }
  }
  return user;
}

// ---------- BARANG (katalog) ----------
function mapBarang(b) {
  return {
    id: b.id,
    kategoriId: b.kategori_id,
    kategori: b.kategori_nama || b.nama_kategori || "Umum",
    nama: b.nama_barang,
    hargaSewa: Number(b.harga_sewa_per_hari ?? b.harga_sewa) || 0,
    hargaJaminan: Number(b.harga_jaminan) || 0,
    stok: b.stok_total !== undefined ? Number(b.stok_total) : Number(b.stok) || 0,
    stokTersedia:
      b.stok_tersedia !== undefined
        ? Number(b.stok_tersedia)
        : b.stok_total !== undefined
        ? Number(b.stok_total)
        : Number(b.stok) || 0,
    kondisi: b.kondisi || "baik",
    foto: resolveFotoBarang({
      foto: b.foto,
      nama: b.nama_barang,
      kategori: b.kategori_nama || b.nama_kategori,
    }),
    deskripsi: b.deskripsi || "",
  };
}

export async function getBarang() {
  const res = await Barang.list();
  const rows = Array.isArray(res) ? res : res?.data || [];
  return rows.map(mapBarang);
}

export async function getBarangById(id) {
  const b = await Barang.get(id);
  const row = b?.data || b;
  return row ? mapBarang(row) : null;
}

export async function createBarang(data) {
  const dasar = {
    kategori_id: Number(data.kategoriId),
    nama_barang: data.nama,
    deskripsi: data.deskripsi || "",
    foto: data.foto || null,
    stok_tersedia: Number(data.stokTersedia ?? data.stok),
    kondisi: data.kondisi || "baik",
  };
  const stok = Number(data.stok);
  const harga = Number(data.hargaSewa);
  const jaminan = Number(data.hargaJaminan) || 0;
  return coba([
    () => Barang.create({ ...dasar, stok_total: stok, harga_sewa_per_hari: harga, harga_jaminan: jaminan }),
    () => Barang.create({ ...dasar, stok, harga_sewa: harga }),
    () => Barang.create({ ...dasar, stok, stok_total: stok, harga_sewa: harga, harga_sewa_per_hari: harga, harga_jaminan: jaminan }),
  ]);
}

export async function updateBarang(id, data) {
  const dasar = {
    kategori_id: Number(data.kategoriId),
    nama_barang: data.nama,
    deskripsi: data.deskripsi || "",
    foto: data.foto || null,
    stok_tersedia: Number(data.stokTersedia ?? data.stok),
    kondisi: data.kondisi || "baik",
  };
  const stok = Number(data.stok);
  const harga = Number(data.hargaSewa);
  const jaminan = Number(data.hargaJaminan) || 0;
  return coba([
    () => Barang.update(id, { ...dasar, stok_total: stok, harga_sewa_per_hari: harga, harga_jaminan: jaminan }),
    () => Barang.update(id, { ...dasar, stok, harga_sewa: harga }),
    () => Barang.update(id, { ...dasar, stok, stok_total: stok, harga_sewa: harga, harga_sewa_per_hari: harga, harga_jaminan: jaminan }),
  ]);
}

export async function deleteBarang(id) {
  return Barang.remove(id);
}

// ---------- KATEGORI ----------
export async function getKategori() {
  const res = await KategoriBarang.list();
  const rows = Array.isArray(res) ? res : res?.data || [];
  return rows.map((k) => ({ id: k.id, nama: k.nama_kategori, deskripsi: k.deskripsi }));
}

// ---------- USERS ----------
function normalizeRole(role) {
  if (role === "penyewa") return "user";
  return role || "user";
}

async function pengajuanPetugasTerbaru() {
  const rows = toRows(await PengajuanPetugas.list());
  const terbaru = {};
  rows.forEach((r) => {
    const k = String(r.user_id);
    if (!terbaru[k] || Number(r.id) > Number(terbaru[k].id)) terbaru[k] = r;
  });
  return terbaru;
}

export async function getUsers() {
  const [res, terbaru] = await Promise.all([
    Users.list(),
    pengajuanPetugasTerbaru().catch(() => ({})),
  ]);
  return toRows(res).map((u) => {
    const roleDb = normalizeRole(u.role);
    const petugas = roleDb === "user" && terbaru[String(u.id)]?.status === "approved";
    return {
      id: u.id,
      nama: u.nama || u.name,
      email: u.email,
      noHp: u.no_telepon || u.no_hp,
      role: petugas ? "petugas" : roleDb,
    };
  });
}

// Sinkronkan role user yang sedang login dengan pengajuan petugas terbarunya
// (disetujui -> petugas, ditolak/dicabut -> kembali user). Dipanggil dari Navbar.
export async function refreshRoleUser() {
  const user = getCurrentUser();
  if (!user?.id || user.role === "admin") return user;
  try {
    const terbaru = (await pengajuanPetugasTerbaru())[String(user.id)];
    const approved = terbaru?.status === "approved";
    if (user.role === "user" && approved) {
      const u = { ...user, role: "petugas", viaPengajuan: true };
      setCurrentUser(u);
      return u;
    }
    if (user.role === "petugas" && user.viaPengajuan && !approved) {
      const { viaPengajuan: _v, ...u } = { ...user, role: "user" };
      setCurrentUser(u);
      return u;
    }
  } catch {
  }
  return user;
}

async function ubahRoleViaPengajuan(id, role) {
  const lama = (await pengajuanPetugasTerbaru())[String(id)];
  const admin = getCurrentUser();
  if (role === "petugas") {
    if (lama?.status === "approved") return true;
    if (lama) {
      return PengajuanPetugas.update(lama.id, {
        user_id: lama.user_id,
        status: "approved",
        catatan: lama.catatan || "",
        reviewed_by: admin?.id,
      });
    }
    return PengajuanPetugas.create({
      user_id: id,
      status: "approved",
      catatan: "Ditetapkan oleh admin",
    });
  }
  if (lama?.status === "approved") {
    return PengajuanPetugas.update(lama.id, {
      user_id: lama.user_id,
      status: "rejected",
      catatan: lama.catatan || "",
      reviewed_by: admin?.id,
    });
  }
  return true;
}

export async function updateUserRole(id, patch) {
  const apiPatch = { ...patch };
  if (apiPatch.role === "user") apiPatch.role = "penyewa";
  if (apiPatch.noHp && !apiPatch.no_telepon) {
    apiPatch.no_telepon = apiPatch.noHp;
    delete apiPatch.noHp;
  }
  const noHp = apiPatch.no_telepon || apiPatch.no_hp;
  const { no_hp: _a, ...tanpaHp } = apiPatch;
  try {
    return await coba([
      () => Users.update(id, { ...tanpaHp, ...(noHp ? { no_telepon: noHp, no_hp: noHp } : {}) }),
      () => Users.update(id, tanpaHp),
      () => {
        const { no_telepon: _b, ...tanpaTelp } = tanpaHp;
        return Users.update(id, { ...tanpaTelp, ...(noHp ? { no_hp: noHp } : {}) });
      },
    ]);
  } catch (err) {
    if (err.status === 403 && ["petugas", "penyewa"].includes(apiPatch.role)) {
      return ubahRoleViaPengajuan(id, apiPatch.role);
    }
    if (err.status === 403) {
      throw new Error("Server API tidak mengizinkan mengubah role ini. Buat akun admin lewat POST /users di docs API.");
    }
    throw err;
  }
}

// ---------- PENGAJUAN PETUGAS ----------
export async function getPengajuanPetugas() {
  const res = await PengajuanPetugas.list();
  const rows = Array.isArray(res) ? res : res?.data || [];
  return rows;
}

// User mengajukan diri. Role TIDAK diubah di sini; admin yang menyetujui.
export async function ajukanJadiPetugas(user, { noHpPetugas, alasan }) {
  if (!user?.id) throw new Error("Sesi pengguna tidak ditemukan.");

  if (noHpPetugas) {
    try {
      await Users.update(user.id, {
        nama: user.nama,
        email: user.email,
        no_telepon: noHpPetugas,
        role: "penyewa",
      });
    } catch {
    }
  }

  return PengajuanPetugas.create({
    user_id: user.id,
    status: "pending",
    catatan: alasan || "",
  });
}

export async function reviewPengajuanPetugas(pengajuan, status, admin) {
  if (!pengajuan?.id) throw new Error("Pengajuan tidak valid.");
  if (!["approved", "rejected"].includes(status)) throw new Error("Status pengajuan tidak valid.");

  const isi = {
    user_id: pengajuan.user_id,
    status,
    catatan: pengajuan.catatan || "",
    reviewed_by: admin?.id,
  };
  try {
    await PengajuanPetugas.update(pengajuan.id, isi);
  } catch {
    await PengajuanPetugas.create(isi);
  }

  if (status === "approved") {
    try {
      const users = await getUsers();
      const target = users.find((u) => String(u.id) === String(pengajuan.user_id));
      if (target) {
        await Users.update(target.id, {
          nama: target.nama,
          email: target.email,
          no_telepon: target.noHp || "-",
          no_hp: target.noHp || "-",
          role: "petugas",
        });
      }
    } catch {
      // diabaikan
    }
  }

  return true;
}

// ---------- PEMINJAMAN ----------
function toRows(res) {
  return Array.isArray(res) ? res : res?.data || [];
}

function mapPeminjaman(p, items = [], statusRiwayat = null, sudahBayar = false) {
  const totalApi =
    Number(p.total_harga ?? p.total_biaya_sewa ?? p.total_bayar ?? p.total) || 0;
  const totalItems = items.reduce((s, i) => s + (Number(i.subtotal) || 0), 0);

  return {
    id: p.id,
    userId: p.user_id,
    userNama: p.user_nama || p.userNama || "",
    kodePesanan: p.kode_pesanan,
    tanggalMulai: p.tanggal_mulai_sewa || p.tgl_mulai,
    tanggalSelesai: p.tanggal_selesai_sewa || p.tgl_selesai,
    status: normalizeStatus(statusRiwayat || p.status),
    // Kalau API tidak menyimpan total, hitung dari detail barang.
    totalBayar: totalApi || totalItems,
    sudahBayar,
    items,
  };
}

function buildItems(p, detailRows, barangMap) {
  const hari = Math.max(
    daysBetween(
      p.tanggal_mulai_sewa || p.tgl_mulai,
      p.tanggal_selesai_sewa || p.tgl_selesai
    ),
    1
  );

  return detailRows
    .filter((d) => String(d.peminjaman_id) === String(p.id))
    .map((d) => {
      const qty = Number(d.jumlah) || 0;
      const barang = barangMap[d.barang_id];
      const hargaBarang = Number(barang?.harga_sewa_per_hari) || 0;

      let subtotal = Number(d.subtotal) || 0;
      if (!subtotal && Number(d.harga_satuan)) subtotal = Number(d.harga_satuan) * qty * hari;
      if (!subtotal) subtotal = hargaBarang * qty * hari;

      return {
        barangId: d.barang_id,
        nama: barang?.nama_barang || `Barang #${d.barang_id}`,
        qty,
        subtotal,
        hargaSewa: qty ? subtotal / (qty * hari) : hargaBarang,
      };
    });
}


async function statusDariRiwayat() {
  try {
    const rows = toRows(await RiwayatStatus.list());
    const terbaru = {};
    rows.forEach((r) => {
      const k = String(r.peminjaman_id);
      if (!terbaru[k] || Number(r.id) > Number(terbaru[k].id)) terbaru[k] = r;
    });
    const hasil = {};
    Object.entries(terbaru).forEach(([k, r]) => {
      const st = r.status_terbaru || r.status_baru || r.status;
      if (st) hasil[k] = st;
    });
    return hasil;
  } catch {
    return {};
  }
}

function adaPembayaran(rows, peminjamanId) {
  return rows.some(
    (b) =>
      String(b.peminjaman_id) === String(peminjamanId) &&
      b.status_verifikasi !== "ditolak" &&
      b.status_pembayaran !== "gagal"
  );
}

async function ambilDataPeminjaman() {
  const [peminjamanRes, detailRes, barangRes, riwayat, bayarRows] = await Promise.all([
    Peminjaman.list(),
    DetailPeminjaman.list(),
    Barang.list(),
    statusDariRiwayat(),
    Pembayaran.list().then(toRows).catch(() => []),
  ]);
  const barangMap = {};
  toRows(barangRes).forEach((b) => {
    barangMap[b.id] = b;
  });
  return { peminjamanRows: toRows(peminjamanRes), detailRows: toRows(detailRes), barangMap, riwayat, bayarRows };
}

export async function getPeminjaman() {
  return getPeminjamanLengkap();
}

export async function getPeminjamanById(id) {
  const [res, detailRes, barangRes, riwayat, bayarRows] = await Promise.all([
    Peminjaman.get(id),
    DetailPeminjaman.list(),
    Barang.list(),
    statusDariRiwayat(),
    Pembayaran.list().then(toRows).catch(() => []),
  ]);
  const row = res?.data || res;
  if (!row) return null;

  const barangMap = {};
  toRows(barangRes).forEach((b) => {
    barangMap[b.id] = b;
  });
  return mapPeminjaman(
    row,
    buildItems(row, toRows(detailRes), barangMap),
    riwayat[String(row.id)],
    adaPembayaran(bayarRows, row.id)
  );
}

export async function buatPeminjaman({
  userId,
  userNama,
  tanggalMulai,
  tanggalSelesai,
  totalBayar,
  items,
}) {
  if (!userId) throw new Error("User tidak ditemukan.");
  if (!tanggalMulai || !tanggalSelesai) {
    throw new Error("Tanggal mulai dan selesai wajib diisi.");
  }

  const hari = daysBetween(tanggalMulai, tanggalSelesai);
  if (hari < 1) throw new Error("Tanggal selesai tidak boleh sebelum tanggal mulai.");

  const kodePesanan = `EVN-${Date.now()}`;

  const total = Number(totalBayar) || 0;
  const docs = { user_id: userId, kode_pesanan: kodePesanan, tgl_mulai: tanggalMulai, tgl_selesai: tanggalSelesai };
  const db = {
    user_id: userId,
    kode_pesanan: kodePesanan,
    tanggal_mulai_sewa: tanggalMulai,
    tanggal_selesai_sewa: tanggalSelesai,
  };

  // Nama kolom di dokumentasi API (tgl_mulai/tgl_selesai) berbeda dari kolom DB
  // (tanggal_mulai_sewa/...), jadi dicoba beberapa bentuk sampai ada yang diterima.
  const created = await coba([
    // Kolom DB asli (status dibiarkan default PENDING).
    () => Peminjaman.create({ ...db, total_biaya_sewa: total }),
    () => Peminjaman.create({ ...db, total_harga: total, total_biaya_sewa: total }),
    () => Peminjaman.create({ ...docs, status: "menunggu_persetujuan", total_harga: total }),
    () => Peminjaman.create({ ...db, status: "menunggu_persetujuan", total_harga: total }),
  ]);

  const peminjamanId = created?.data?.id || created?.id;
  if (!peminjamanId) throw new Error("API tidak mengembalikan ID peminjaman.");

  // subtotal detail = total biaya item selama seluruh periode sewa.
  for (const it of items || []) {
    const qty = Number(it.qty) || 0;
    const hargaSewa = Number(it.hargaSewa ?? it.harga_sewa_per_hari ?? it.harga_sewa ?? 0);

    const payload = {
      peminjaman_id: peminjamanId,
      barang_id: it.barangId,
      jumlah: qty,
      subtotal: hargaSewa * qty * hari,
    };
    try {
      await DetailPeminjaman.create({ ...payload, harga_satuan: hargaSewa });
    } catch {
      await DetailPeminjaman.create(payload);
    }
  }

  return mapPeminjaman(
    {
      id: peminjamanId,
      user_id: userId,
      kode_pesanan: kodePesanan,
      tanggal_mulai_sewa: tanggalMulai,
      tanggal_selesai_sewa: tanggalSelesai,
      status: "menunggu_persetujuan",
      total_harga: Number(totalBayar) || 0,
    },
    items
  );
}

export async function getDetailPeminjaman(peminjamanId) {
  const res = await DetailPeminjaman.list();
  const rows = Array.isArray(res) ? res : res?.data || [];
  return rows.filter((d) => String(d.peminjaman_id) === String(peminjamanId));
}

// Gabungkan peminjaman + detail_peminjaman + nama barang, dipakai halaman status.
export async function getPeminjamanLengkap() {
  const { peminjamanRows, detailRows, barangMap, riwayat, bayarRows } = await ambilDataPeminjaman();
  return peminjamanRows.map((p) =>
    mapPeminjaman(
      p,
      buildItems(p, detailRows, barangMap),
      riwayat[String(p.id)],
      adaPembayaran(bayarRows, p.id)
    )
  );
}

const STATUS_UPPER = {
  menunggu_persetujuan: "PENDING",
  disetujui: "APPROVED",
  ditolak: "REJECTED",
  dibatalkan: "CANCELLED",
  siap_diambil: "SIAP_DIAMBIL",
  sedang_dipinjam: "SEDANG_DI_SEWA",
  terlambat: "SEDANG_DI_SEWA",
  dikembalikan: "DIKEMBALIKAN",
  diperiksa: "DIKEMBALIKAN",
  selesai: "COMPLETED",
};

export async function ubahStatusPeminjaman(id, status) {
  const res = await Peminjaman.get(id);
  const raw = res?.data || res;
  if (!raw) throw new Error("Peminjaman tidak ditemukan");
  const current = await getPeminjamanById(id);

  const mulai = String(raw.tanggal_mulai_sewa || raw.tgl_mulai || "").slice(0, 10);
  const selesai = String(raw.tanggal_selesai_sewa || raw.tgl_selesai || "").slice(0, 10);
  const total = current?.totalBayar || 0;

  const rawBersih = { ...raw };
  ["id", "created_at", "updated_at"].forEach((k) => delete rawBersih[k]);
  if (mulai) {
    if ("tanggal_mulai_sewa" in rawBersih) rawBersih.tanggal_mulai_sewa = mulai;
    if ("tgl_mulai" in rawBersih) rawBersih.tgl_mulai = mulai;
  }
  if (selesai) {
    if ("tanggal_selesai_sewa" in rawBersih) rawBersih.tanggal_selesai_sewa = selesai;
    if ("tgl_selesai" in rawBersih) rawBersih.tgl_selesai = selesai;
  }

  const docs = {
    user_id: raw.user_id,
    kode_pesanan: raw.kode_pesanan,
    tgl_mulai: mulai,
    tgl_selesai: selesai,
    total_harga: total,
  };
  const gabungan = { ...rawBersih, ...docs, tanggal_mulai_sewa: mulai, tanggal_selesai_sewa: selesai };

  const lower = String(status).toLowerCase();
  const upper = STATUS_UPPER[lower] || String(status).toUpperCase();
  const mentahUpper = /^[A-Z_]+$/.test(String(raw.status || ""));
  const urutan = mentahUpper ? [upper, lower] : [lower, upper];

  const varian = [];
  for (const nilai of urutan) {
    for (const body of [docs, gabungan, rawBersih]) {
      varian.push(() => Peminjaman.update(id, { ...body, status: nilai }));
    }
  }
  let putErr = null;
  try {
    await coba(varian);
  } catch (err) {
    putErr = err;
  }

  // Selalu catat di riwayat_status (dipakai sebagai status terbaru bila PUT diblokir).
  const pid = Number(id);
  const sebelumnya = current?.status || null;
  try {
    await coba([
      () =>
        RiwayatStatus.create({
          peminjaman_id: pid,
          status: lower,
          changed_by: getCurrentUser()?.id || null,
          keterangan: "Diubah dari aplikasi",
        }),
      () =>
        RiwayatStatus.create({
          peminjaman_id: pid,
          status_sebelumnya: sebelumnya,
          status_terbaru: lower,
          catatan: "Diubah dari aplikasi",
        }),
      () => RiwayatStatus.create({ peminjaman_id: pid, status_terbaru: lower }),
      () =>
        RiwayatStatus.create({
          peminjaman_id: pid,
          status_lama: sebelumnya,
          status_baru: lower,
        }),
      () => RiwayatStatus.create({ peminjaman_id: pid, status: lower, catatan: "Diubah dari aplikasi" }),
    ]);
    return true;
  } catch (err) {
    if (!putErr) return true;
    throw new Error(
      `Gagal mengubah status. PUT /peminjaman/${id}: ${putErr.message}. ` +
        `Cadangan POST /riwayat_status juga gagal: ${err.message}`
    );
  }
}

// ---------- PEMBAYARAN ----------
export async function getPembayaranList() {
  const res = await Pembayaran.list();
  const rows = Array.isArray(res) ? res : res?.data || [];

  rows.sort((a, b) => Number(b.id) - Number(a.id));

  return rows.map((p) => ({
    ...p,
    jenis: p.jenis || "lunas",
    jumlah: Number(p.jumlah ?? p.jumlah_bayar ?? 0),
    jumlah_bayar: Number(p.jumlah ?? p.jumlah_bayar ?? 0),
    metode: p.metode || p.metode_bayar || "",
    metode_bayar: p.metode || p.metode_bayar || "",
    status_verifikasi: p.status_verifikasi || "pending",
    status_pembayaran:
      p.status_pembayaran ||
      (p.status_verifikasi === "diverifikasi" ? "lunas" : "menunggu_konfirmasi"),
  }));
}

export async function buatPembayaran({ peminjamanId, jumlahBayar, metodeBayar }) {
  const jumlah = Number(jumlahBayar) || 0;
  const metodeDocs = /qris/i.test(metodeBayar || "") ? "QRIS" : "Transfer";
  return coba([
    // Kolom DB asli
    () =>
      Pembayaran.create({
        peminjaman_id: peminjamanId,
        jenis: "lunas",
        jumlah,
        metode: metodeBayar,
        status_verifikasi: "pending",
      }),
    // Kolom sesuai docs
    () =>
      Pembayaran.create({
        peminjaman_id: peminjamanId,
        jumlah_bayar: jumlah,
        metode_bayar: metodeDocs,
        status_pembayaran: "menunggu_konfirmasi",
      }),
  ]);
}

export async function verifikasiPembayaran(pembayaranId, { peminjamanId, jumlahBayar, metodeBayar }) {
  const jumlah = Number(jumlahBayar) || 0;
  const metodeDocs = /qris/i.test(metodeBayar || "") ? "QRIS" : "Transfer";
  const admin = getCurrentUser();
  const dbAsli = {
    peminjaman_id: peminjamanId,
    jenis: "lunas",
    jumlah,
    metode: metodeBayar || "qris",
    status_verifikasi: "diverifikasi",
    verified_by: admin?.id || null,
  };
  const docs = {
    peminjaman_id: peminjamanId,
    jumlah_bayar: jumlah,
    metode_bayar: metodeDocs,
    status_pembayaran: "lunas",
  };
  try {
    await Pembayaran.update(pembayaranId, dbAsli);
  } catch {
    await coba([
      () => Pembayaran.create(dbAsli),
      () => Pembayaran.create({ ...dbAsli, verified_by: undefined }),
      () => Pembayaran.create(docs),
    ]);
  }
  return ubahStatusPeminjaman(peminjamanId, "siap_diambil");
}

// ---------- PENGECEKAN BARANG ----------
export async function buatPengecekan({ peminjamanId, barangId, statusKondisi, catatan }) {
  const petugas = getCurrentUser();
  if (!petugas?.id) throw new Error("Sesi petugas tidak ditemukan.");

  return coba([
    () =>
      PengecekanBarang.create({
        peminjaman_id: peminjamanId,
        petugas_id: petugas.id,
        tipe: "saat_kembali",
        kondisi: statusKondisi,
        catatan_kerusakan: catatan || "",
      }),
    () =>
      PengecekanBarang.create({
        peminjaman_id: peminjamanId,
        barang_id: barangId,
        status_kondisi: statusKondisi,
        catatan: catatan || "",
      }),
  ]);
}

export { apiMe };