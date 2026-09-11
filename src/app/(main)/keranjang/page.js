"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import KeranjangItem from "@/components/peminjaman/KeranjangItem";
import Button from "@/components/ui/Button";
import { getCart, updateQty, removeFromCart } from "@/lib/cart";
import { formatRupiah } from "@/lib/utils";

export default function KeranjangPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  function handleQtyChange(barangId, qty) {
    setCart(updateQty(barangId, qty));
  }

  function handleRemove(barangId) {
    setCart(removeFromCart(barangId));
  }

  const totalSewa = cart.reduce((sum, item) => sum + item.hargaSewa * item.qty, 0);
  const totalJaminan = cart.reduce((sum, item) => sum + item.jaminan * item.qty, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Keranjang Sewa</h1>

      {cart.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center text-slate-400">
          Keranjang masih kosong.{" "}
          <Link href="/barang" className="text-emerald-600 hover:underline">
            Lihat katalog
          </Link>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-slate-200 bg-white px-4">
            {cart.map((item) => (
              <KeranjangItem
                key={item.barangId}
                item={item}
                onQtyChange={handleQtyChange}
                onRemove={handleRemove}
              />
            ))}
          </div>

          <div className="mt-6 space-y-1 rounded-xl border border-slate-200 bg-white p-4 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Total sewa/hari</span>
              <span>{formatRupiah(totalSewa)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total jaminan</span>
              <span>{formatRupiah(totalJaminan)}</span>
            </div>
          </div>

          <Button className="mt-4" onClick={() => router.push("/checkout")}>
            Lanjut ke Checkout
          </Button>
        </>
      )}
    </div>
  );
}
