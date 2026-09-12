"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FormCheckout from "@/components/peminjaman/FormCheckout";
import { getCart } from "@/lib/cart";

export default function CheckoutPage() {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    setCart(getCart());
  }, []);

  if (cart === null) {
    return <p className="p-12 text-center">Memuat...</p>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-black">Checkout Pengajuan</h1>
      {!cart.length ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-slate-500">
          Keranjang kosong.{" "}
          <Link href="/barang" className="text-emerald-600">
            Kembali ke katalog
          </Link>
        </div>
      ) : (
        <FormCheckout cart={cart} />
      )}
    </div>
  );
}