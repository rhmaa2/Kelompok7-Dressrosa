import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  if (!body.nama || !body.email || !body.password) {
    return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
  }
  
  return NextResponse.json({ message: "API demo aktif. Registrasi frontend menggunakan localStorage." }, { status: 201 });
}