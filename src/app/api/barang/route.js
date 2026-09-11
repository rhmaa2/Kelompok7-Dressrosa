export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/barang -> daftar semua barang (dipakai katalog & admin kelola barang)
export async function GET() {
  try {
    const rows = await query("SELECT * FROM barang ORDER BY id DESC");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/barang error:", error);
    return NextResponse.json({ message: "Gagal mengambil data barang" }, { status: 500 });
  }
}

// POST /api/barang -> tambah barang baru (Admin - CRUD barang)
export async function POST(request) {
  try {
    const { nama, kategori, deskripsi, hargaSewa, jaminan, stok, gambar } = await request.json();

    if (!nama || !kategori) {
      return NextResponse.json({ message: "Nama dan kategori wajib diisi" }, { status: 400 });
    }

    const result = await query(
      "INSERT INTO barang (nama, kategori, deskripsi, harga_sewa, jaminan, stok, gambar) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [nama, kategori, deskripsi || "", hargaSewa, jaminan, stok, gambar || "📦"]
    );

    return NextResponse.json({ message: "Barang ditambahkan", id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error("POST /api/barang error:", error);
    return NextResponse.json({ message: "Gagal menambah barang" }, { status: 500 });
  }
}
