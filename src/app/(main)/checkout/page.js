"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FormCheckout from "@/components/peminjaman/FormCheckout";
import { getCart } from "@/lib/cart";
import { getCurrentUser } from "@/lib/store";

export default function CheckoutPage() {
  const [cart, setCart] = useState(null);
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setCart(getCart());
    setUser(getCurrentUser());
    setChecked(true);
  }, []);

  if (cart === null || !checked) {
    return <p className="p-12 text-center">Memuat...</p>;
  }

  // Belum login -> tolak checkout, minta login dulu
  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-black">Checkout Pengajuan</h1>
        <div className="rounded-xl border border-dashed border-red-300 bg-red-50 p-12 text-center">
          <p className="font-semibold text-red-600">
            Kamu harus login dulu untuk melanjutkan checkout.
          </p>
          <Link
            href="/login?redirect=/checkout"
            className="mt-4 inline-block rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Login Sekarang
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-black">Checkout Pengajuan</h1>
      {!cart.length ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-slate-500">
          Keranjang kosong.{" "}
          <Link href="/barang" className="text-blue-600">
            Kembali ke katalog
          </Link>
        </div>
      ) : (
        <FormCheckout cart={cart} />
      )}
    </div>
  );
}