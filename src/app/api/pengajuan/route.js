import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json([]); }
export async function POST(request) { return NextResponse.json({ message: "API demo aktif", data: await request.json() }, { status: 201 }); }
