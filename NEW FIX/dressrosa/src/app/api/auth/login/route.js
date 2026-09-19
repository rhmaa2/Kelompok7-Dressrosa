import { NextResponse } from "next/server";

export async function POST(request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ message: "Email dan password wajib diisi" }, { status: 400 });
  }
  return NextResponse.json({ message: "API demo aktif. Login frontend menggunakan localStorage." });
}