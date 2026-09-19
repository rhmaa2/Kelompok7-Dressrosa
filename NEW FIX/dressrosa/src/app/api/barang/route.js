import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json([]); }
export async function POST(request) { const body = await request.json(); return NextResponse.json({ message: "API demo aktif", data: body }, { status: 201 }); }