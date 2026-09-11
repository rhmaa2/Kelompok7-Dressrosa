import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";

// CATATAN: nama tabel & kolom di bawah masih PLACEHOLDER (users: id, nama, email,
// no_hp, alamat, password, role, created_at). Sesuaikan begitu struktur tabel asli dikirim.

export async function POST(request) {
  try {
    const { nama, email, noHp, alamat, password } = await request.json();

    if (!nama || !email || !password) {
      return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
    }

    // Cek email sudah dipakai atau belum
    const existing = await query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return NextResponse.json({ message: "Email sudah terdaftar" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await query(
      "INSERT INTO users (nama, email, no_hp, alamat, password, role) VALUES (?, ?, ?, ?, ?, 'user')",
      [nama, email, noHp, alamat, hashedPassword]
    );

    return NextResponse.json({ message: "Registrasi berhasil" }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
