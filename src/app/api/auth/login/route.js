import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";

// CATATAN: nama tabel & kolom di bawah masih PLACEHOLDER, sama seperti register/route.js

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email dan password wajib diisi" }, { status: 400 });
    }

    const users = await query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return NextResponse.json({ message: "Email atau password salah" }, { status: 401 });
    }

    const user = users[0];
    const cocok = await bcrypt.compare(password, user.password);

    if (!cocok) {
      return NextResponse.json({ message: "Email atau password salah" }, { status: 401 });
    }

    // Belum pakai session/JWT — sementara kirim balik data user (tanpa password)
    const { password: _pw, ...userTanpaPassword } = user;

    return NextResponse.json({ message: "Login berhasil", user: userTanpaPassword });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
