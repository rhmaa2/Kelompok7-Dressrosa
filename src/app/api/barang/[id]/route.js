export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/barang/:id -> detail 1 barang (halaman detail barang)
export async function GET(request, { params }) {
  try {
    const rows = await query("SELECT * FROM barang WHERE id = ?", [params.id]);
    if (rows.length === 0) {
      return NextResponse.json({ message: "Barang tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("GET /api/barang/[id] error:", error);
    return NextResponse.json({ message: "Gagal mengambil data barang" }, { status: 500 });
  }
}

// PUT /api/barang/:id -> update barang (Admin - CRUD barang)
export async function PUT(request, { params }) {
  try {
    const { nama, kategori, deskripsi, hargaSewa, jaminan, stok, gambar } = await request.json();

    await query(
      "UPDATE barang SET nama = ?, kategori = ?, deskripsi = ?, harga_sewa = ?, jaminan = ?, stok = ?, gambar = ? WHERE id = ?",
      [nama, kategori, deskripsi || "", hargaSewa, jaminan, stok, gambar || "📦", params.id]
    );

    return NextResponse.json({ message: "Barang diperbarui" });
  } catch (error) {
    console.error("PUT /api/barang/[id] error:", error);
    return NextResponse.json({ message: "Gagal memperbarui barang" }, { status: 500 });
  }
}

// DELETE /api/barang/:id -> hapus barang (Admin - CRUD barang)
export async function DELETE(request, { params }) {
  try {
    await query("DELETE FROM barang WHERE id = ?", [params.id]);
    return NextResponse.json({ message: "Barang dihapus" });
  } catch (error) {
    console.error("DELETE /api/barang/[id] error:", error);
    return NextResponse.json({ message: "Gagal menghapus barang" }, { status: 500 });
  }
}
