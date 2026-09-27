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

    window.addEventListener("cart:updated", refreshCount);
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
        <Link href="/" className="gradient-text text-xl font-black">
          EVENTRA
        </Link>

        <div className="hidden items-center gap-5 md:flex">

          {user && (
            <>
              <Link href="/status" className="text-sm font-medium text-slate-600 hover:text-indigo-600">
                Status
              </Link>
              <Link href="/status/riwayat" className="text-sm font-medium text-slate-600 hover:text-indigo-600">
                Riwayat
              </Link>
              {user?.role === "user" && (
                <Link href="/jadi-petugas" className="text-sm font-medium text-slate-600 hover:text-indigo-600">
                  Jadi Petugas
                </Link>
              )}
              {user?.role === "admin" && (
                <Link href="/admin/dashboard" className="text-sm font-semibold text-indigo-600">
                  Admin
                </Link>
              )}
              {user?.role === "petugas" && (
                <Link href="/petugas/dashboard" className="text-sm font-semibold text-indigo-600">
                  Petugas
                </Link>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/keranjang"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:border-indigo-300 hover:bg-indigo-50"
          >
            🛒 {count}
          </Link>

          {user ? (
            <button
              onClick={keluar}
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Keluar
            </button>
          ) : (
            <Link href="/login" className="btn-gradient rounded-lg px-3 py-2 text-sm font-semibold">
              Masuk
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}