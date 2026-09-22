"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCart, removeFromCart, updateQty } from "@/lib/cart";
import KeranjangItem from "@/components/peminjaman/KeranjangItem";
import { formatRupiah } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface CartItem {
  barangId: string | number;
  namaBarang: string;
  hargaSewa: number;
  jaminan: number;
  qty: number;
  [key: string]: any;
}

export default function KeranjangPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const totalRentalPricePerDay = cartItems.reduce(
    (sum, item) => sum + item.hargaSewa * item.qty,
    0
  );
  const totalDeposit = cartItems.reduce(
    (sum, item) => sum + item.jaminan * item.qty,
    0
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-black">Keranjang Sewa</h1>

      {cartItems.length === 0 ? (
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
            {cartItems.map((item) => (
              <KeranjangItem
                key={item.barangId}
                item={item}
                onQty={(newQty) =>
                  setCartItems(updateQty(item.barangId, newQty))
                }
                onRemove={() =>
                  setCartItems(removeFromCart(item.barangId))
                }
              />
            ))}
          </div>

          <aside className="h-fit rounded-xl border bg-white p-5">
            <h2 className="font-bold">Ringkasan</h2>
            <div className="mt-4 space-y-2 text-sm">
              <p className="flex justify-between">
                <span>Total sewa/hari</span>
                <b>{formatRupiah(totalRentalPricePerDay)}</b>
              </p>
              <p className="flex justify-between">
                <span>Total jaminan</span>
                <b>{formatRupiah(totalDeposit)}</b>
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