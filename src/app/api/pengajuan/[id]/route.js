export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/pengajuan/:id -> detail 1 pengajuan (halaman status detail)
export async function GET(request, { params }) {
  try {
    const rows = await query("SELECT * FROM pengajuan WHERE id = ?", [params.id]);
    if (rows.length === 0) {
      return NextResponse.json({ message: "Pengajuan tidak ditemukan" }, { status: 404 });
    }

    const items = await query("SELECT * FROM pengajuan_item WHERE pengajuan_id = ?", [params.id]);
    const p = rows[0];

    return NextResponse.json({
      ...p,
      tanggalMulai: p.tanggal_mulai,
      tanggalSelesai: p.tanggal_selesai,
      totalSewa: p.total_sewa,
      totalJaminan: p.total_jaminan,
      totalBayar: p.total_bayar,
      sudahBayar: !!p.sudah_bayar,
      kondisiAwal: p.kondisi_awal,
      kondisiAkhir: p.kondisi_akhir,
      userNama: p.user_nama,
      items: items.map((it) => ({
        barangId: it.barang_id,
        nama: it.nama,
        hargaSewa: it.harga_sewa,
        jaminan: it.jaminan,
        qty: it.qty,
      })),
    });
  } catch (error) {
    console.error("GET /api/pengajuan/[id] error:", error);
    return NextResponse.json({ message: "Gagal mengambil data pengajuan" }, { status: 500 });
  }
}

// PATCH /api/pengajuan/:id -> update status
// Dipakai oleh: user (batalkan, upload bukti bayar, konfirmasi terima),
// admin (approve/reject, verifikasi pembayaran), petugas (siap kirim, kondisi kembali)
export async function PATCH(request, { params }) {
  try {
    const body = await request.json();

    const kolomBolehDiubah = {
      status: "status",
      sudahBayar: "sudah_bayar",
      kondisiAwal: "kondisi_awal",
      kondisiAkhir: "kondisi_akhir",
    };

    const setClauses = [];
    const values = [];

    for (const [key, kolom] of Object.entries(kolomBolehDiubah)) {
      if (body[key] !== undefined) {
        setClauses.push(`${kolom} = ?`);
        values.push(body[key]);
      }
    }

    if (setClauses.length === 0) {
      return NextResponse.json({ message: "Tidak ada data yang diubah" }, { status: 400 });
    }

    values.push(params.id);
    await query(`UPDATE pengajuan SET ${setClauses.join(", ")} WHERE id = ?`, values);

    return NextResponse.json({ message: "Pengajuan diperbarui" });
  } catch (error) {
    console.error("PATCH /api/pengajuan/[id] error:", error);
    return NextResponse.json({ message: "Gagal memperbarui pengajuan" }, { status: 500 });
  }
}
