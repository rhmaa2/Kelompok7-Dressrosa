export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { query, getPool } from "@/lib/db";

async function lampirkanItems(daftarPengajuan) {
  if (daftarPengajuan.length === 0) return [];

  const ids = daftarPengajuan.map((p) => p.id);
  const placeholders = ids.map(() => "?").join(",");
  const items = await query(
    `SELECT * FROM pengajuan_item WHERE pengajuan_id IN (${placeholders})`,
    ids
  );

  return daftarPengajuan.map((p) => ({
    ...p,
    // ubah nama kolom snake_case jadi camelCase biar konsisten sama frontend
    tanggalMulai: p.tanggal_mulai,
    tanggalSelesai: p.tanggal_selesai,
    totalSewa: p.total_sewa,
    totalJaminan: p.total_jaminan,
    totalBayar: p.total_bayar,
    sudahBayar: !!p.sudah_bayar,
    kondisiAwal: p.kondisi_awal,
    kondisiAkhir: p.kondisi_akhir,
    userNama: p.user_nama,
    items: items
      .filter((it) => it.pengajuan_id === p.id)
      .map((it) => ({
        barangId: it.barang_id,
        nama: it.nama,
        hargaSewa: it.harga_sewa,
        jaminan: it.jaminan,
        qty: it.qty,
      })),
  }));
}

// GET /api/pengajuan -> daftar semua pengajuan (dipakai status user, admin, petugas)
export async function GET() {
  try {
    const rows = await query("SELECT * FROM pengajuan ORDER BY created_at DESC");
    const hasil = await lampirkanItems(rows);
    return NextResponse.json(hasil);
  } catch (error) {
    console.error("GET /api/pengajuan error:", error);
    return NextResponse.json({ message: "Gagal mengambil data pengajuan" }, { status: 500 });
  }
}

// POST /api/pengajuan -> submit checkout (Anggota 2 - Peminjaman)
export async function POST(request) {
  const pool = getPool();
  const conn = await pool.getConnection();

  try {
    const {
      userNama,
      items,
      tanggalMulai,
      tanggalSelesai,
      metode,
      alamat,
      totalSewa,
      totalJaminan,
      totalBayar,
    } = await request.json();

    if (!userNama || !items || items.length === 0) {
      return NextResponse.json({ message: "Data pengajuan tidak lengkap" }, { status: 400 });
    }

    await conn.beginTransaction();

    const [result] = await conn.execute(
      `INSERT INTO pengajuan
        (user_nama, tanggal_mulai, tanggal_selesai, metode, alamat, total_sewa, total_jaminan, total_bayar, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')`,
      [userNama, tanggalMulai, tanggalSelesai, metode, alamat || null, totalSewa, totalJaminan, totalBayar]
    );

    const pengajuanId = result.insertId;

    for (const item of items) {
      await conn.execute(
        "INSERT INTO pengajuan_item (pengajuan_id, barang_id, nama, harga_sewa, jaminan, qty) VALUES (?, ?, ?, ?, ?, ?)",
        [pengajuanId, item.barangId, item.nama, item.hargaSewa, item.jaminan, item.qty]
      );
    }

    await conn.commit();

    return NextResponse.json({ message: "Pengajuan berhasil dibuat", id: pengajuanId }, { status: 201 });
  } catch (error) {
    await conn.rollback();
    console.error("POST /api/pengajuan error:", error);
    return NextResponse.json({ message: "Gagal membuat pengajuan" }, { status: 500 });
  } finally {
    conn.release();
  }
}
