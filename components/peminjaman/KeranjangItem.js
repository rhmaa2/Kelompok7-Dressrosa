"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Keranjang from "@/components/Keranjang"; // Sesuaikan path import foldernya jika berbeda
import { getCart, updateCartQty, removeFromCart } from "@/lib/cart";
import { formatRupiah } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function KeranjangItem() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data keranjang saat komponen pertama kali dirender di client
  useEffect(() => {
    setCartItems(getCart() || []);
    setLoading(false);
  }, []);

  // Handler untuk mengubah jumlah (qty) barang
  const handleUpdateQty = (barangId, newQty) => {
    const updated = updateCartQty(barangId, newQty);
    setCartItems([...updated]);
  };

  // Handler untuk menghapus barang dari keranjang
  const handleRemoveItem = (barangId) => {
    const updated = removeFromCart(barangId);
    setCartItems([...updated]);
  };

  // Hitung total harga keseluruhan barang di keranjang
  const totalHarga = cartItems.reduce(
    (sum, item) => sum + item.hargaSewa * item.qty,
    0
  );

  if (loading) {
    return <p className="p-12 text-center text-slate-500">Memuat keranjang...</p>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-black text-slate-900">Keranjang Sewa</h1>

      {cartItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <p className="text-slate-500">Keranjangmu masih kosong nih.</p>
          <Link
            href="/barang"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            Cari Barang Sewa
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Daftar Item Keranjang */}
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-2 shadow-sm">
            {cartItems.map((item) => (
              <Keranjang
                key={item.barangId || item.id}
                item={item}
                onQty={(newQty) => handleUpdateQty(item.barangId || item.id, newQty)}
                onRemove={() => handleRemoveItem(item.barangId || item.id)}
              />
            ))}
          </div>

          {/* Bagian Total & Tombol Checkout */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center justify-between text-base">
              <span className="font-medium text-slate-700">Total Keseluruhan</span>
              <span className="text-xl font-bold text-slate-900">
                {formatRupiah(totalHarga)}
              </span>
            </div>

            <div className="mt-5">
              <Link href="/checkout">
                <Button className="w-full">Lanjut ke Checkout →</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}