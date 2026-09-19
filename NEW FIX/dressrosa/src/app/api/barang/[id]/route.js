import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json({ message: "Gunakan data localStorage frontend." }); }
export async function PUT(request) { return NextResponse.json({ message: "API demo aktif", data: await request.json() }); }
export async function DELETE() { return NextResponse.json({ message: "API demo aktif" }); }