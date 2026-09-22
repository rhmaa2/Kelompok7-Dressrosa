import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://hmif.if.unram.ac.id/api/v3";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

async function forward(request, { params }) {
  const { path } = await params;
  const url = new URL(request.url);
  const target = `${API_BASE}/${path.join("/")}${url.search}`;

  const headers = { "Content-Type": "application/json", "X-API-Key": API_KEY };
  const auth = request.headers.get("authorization");
  if (auth) headers["Authorization"] = auth;

  const method = request.method;
  const body = ["GET", "HEAD", "DELETE"].includes(method) ? undefined : await request.text();

  try {
    const res = await fetch(target, { method, headers, body, cache: "no-store" });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("content-type") || "application/json" },
    });
  } catch (err) {
    return NextResponse.json(
      { message: `Server tidak bisa menghubungi API: ${err.message}` },
      { status: 502 }
    );
  }
}

export { forward as GET, forward as POST, forward as PUT, forward as PATCH, forward as DELETE };