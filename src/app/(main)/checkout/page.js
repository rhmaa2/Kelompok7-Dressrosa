"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FormCheckout from "@/components/peminjaman/FormCheckout";
import { getCart } from "@/lib/cart";

export default putih / export default function CheckoutPage() {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    const dataCart = getCart() || [];
    setCart(dataCart);
  }, []);

  if (cart === null) {
    return <p className="p-12 text-center text-slate-500">Memuat...</p>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-black text-slate-900">Checkout Pengajuan</h1>
      {!cart.length ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
          Keranjang kosong.{" "}
          <Link href="/barang" className="font-medium text-blue-600 hover:underline">
            Kembali ke katalog
          </Link>
        </div>
      ) : (
        <FormCheckout cart={cart} />
      )}
    </div>
  );
}