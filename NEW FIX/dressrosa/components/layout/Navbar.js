"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCart } from "@/lib/cart";
import { getCurrentUser, logout, refreshRoleUser } from "@/lib/store";

export default function Navbar() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const refreshCount = () =>
      setCount(getCart().reduce((s, x) => s + x.qty, 0));

    refreshCount();
    setUser(getCurrentUser());
    refreshRoleUser().then((u) => u && setUser(u));

    // Update badge saat keranjang berubah di tab/halaman ini...
    window.addEventListener("cart:updated", refreshCount);
    // ...dan saat berubah dari tab lain (localStorage di-share antar tab).
    window.addEventListener("storage", refreshCount);

    return () => {
      window.removeEventListener("cart:updated", refreshCount);
      window.removeEventListener("storage", refreshCount);
    };
  }, []);

  function keluar() {
    logout();
    location.href = "/login";
  }

  return (
    <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-black text-blue-600">
          EVENTRA
        </Link>

        <div className="hidden items-center gap-5 md:flex">
          <Link href="/barang" className="text-sm font-medium hover:text-blue-600">
            Katalog
          </Link>

          <Link href="/status" className="text-sm font-medium hover:text-blue-600">
            Status
          </Link>

          <Link href="/status/riwayat" className="text-sm font-medium hover:text-blue-600">
            Riwayat
          </Link>

          {(!user || user?.role === "user") && (
            <Link href="/jadi-petugas" className="text-sm font-medium hover:text-blue-600">
              Jadi Petugas
            </Link>
          )}

          {user?.role === "admin" && (
            <Link href="/admin/dashboard" className="text-sm font-medium text-blue-600">
              Admin
            </Link>
          )}

          {user?.role === "petugas" && (
            <Link href="/petugas/dashboard" className="text-sm font-medium text-blue-600">
              Petugas
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/keranjang" className="rounded-lg border px-3 py-2 text-sm">
            🛒 {count}
          </Link>

          {user ? (
            <button
              onClick={keluar}
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white"
            >
              Keluar
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
            >
              Masuk
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}