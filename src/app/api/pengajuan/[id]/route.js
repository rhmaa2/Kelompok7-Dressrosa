import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(request, { params }) { return NextResponse.json({ id: params.id, message: "Gunakan data localStorage frontend." }); }
export async function PATCH(request) { return NextResponse.json({ message: "API demo aktif", data: await request.json() }); }

