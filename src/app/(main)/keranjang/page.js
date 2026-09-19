"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCart, removeFromCart, updateQty } from "@/lib/cart";
import KeranjangItem from "@/components/peminjaman/KeranjangItem";
import { formatRupiah } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function KeranjangPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const sewa = cart.reduce((s, x) => s + x.hargaSewa * x.qty, 0);
  const jaminan = cart.reduce((s, x) => s + x.jaminan * x.qty, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-black">Keranjang Sewa</h1>

      {!cart.length ? (
        <div className="mt-6 rounded-xl border border-dashed p-12 text-center text-slate-500">
          Keranjang masih kosong.
          <br />
          <Link
            href="/barang"
            className="mt-2 inline-block font-semibold text-blue-600"
          >
            Lihat katalog
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_320px]">
          <div className="rounded-xl border bg-white px-5">
            {cart.map((x) => (
              <KeranjangItem
                key={x.barangId}
                item={x}
                onQty={(q) => setCart(updateQty(x.barangId, q))}
                onRemove={() => setCart(removeFromCart(x.barangId))}
              />
            ))}
          </div>

          <aside className="h-fit rounded-xl border bg-white p-5">
            <h2 className="font-bold">Ringkasan</h2>
            <div className="mt-4 space-y-2 text-sm">
              <p className="flex justify-between">
                <span>Total sewa/hari</span>
                <b>{formatRupiah(sewa)}</b>
              </p>
              <p className="flex justify-between">
                <span>Total jaminan</span>
                <b>{formatRupiah(jaminan)}</b>
              </p>
            </div>
            <Link href="/checkout" className="mt-5 block">
              <Button className="w-full">Lanjut Checkout</Button>
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}