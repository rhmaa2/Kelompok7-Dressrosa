"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FormCheckout from "@/components/peminjaman/FormCheckout";
import { getCart } from "@/lib/cart";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCart(getCart());
    setLoaded(true);
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Checkout Pengajuan</h1>

      {loaded && cart.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center text-slate-400">
          Keranjang kosong, tidak ada yang bisa di-checkout.{" "}
          <Link href="/barang" className="text-emerald-600 hover:underline">
            Lihat katalog
          </Link>
        </div>
      ) : (
        <FormCheckout cart={cart} />
      )}
    </div>
  );
}
