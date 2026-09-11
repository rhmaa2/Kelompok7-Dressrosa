export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/users -> daftar user (Admin - Kelola User)
export async function GET() {
  try {
    const rows = await query("SELECT id, nama, email, no_hp, alamat, role, created_at FROM users ORDER BY id DESC");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json({ message: "Gagal mengambil data user" }, { status: 500 });
  }
}
