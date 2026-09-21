"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { getBarang } from "@/lib/store";
import { addToCart } from "@/lib/cart";
import { formatRupiah } from "@/lib/utils";

export default function DetailBarangPage() {
  const { id } = useParams();
  const router = useRouter();
  const [barang, setBarang] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const dataList = getBarang() || [];
    const found = dataList.find((x) => String(x.id) === String(id));
    setBarang(found || false);
  }, [id]);

  if (barang === null) {
    return <p className="p-12 text-center text-slate-500">Memuat...</p>;
  }

  if (barang === false) {
    return (
      <div className="p-12 text-center text-slate-600">
        Barang tidak ditemukan.{" "}
        <Link href="/barang" className="font-medium text-blue-600 hover:underline">
          Kembali
        </Link>
      </div>
    );
  }

  const handleIncrement = () => {
    setQty((prev) => Math.min(barang.stok, prev + 1));
  };

  const handleDecrement = () => {
    setQty((prev) => Math.max(1, prev - 1));
  };

  const handleAddToCart = () => {
    addToCart(barang, qty);
    setAdded(true);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link href="/barang" className="text-sm text-slate-500 hover:text-slate-800">
        ← Katalog
      </Link>

      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <div className="flex h-80 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
          <img
            src={barang.gambar}
            alt={barang.nama}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <p className="text-sm font-semibold text-blue-600">
            {barang.kategori}
          </p>
          <h1 className="mt-1 text-3xl font-black text-slate-900">{barang.nama}</h1>
          <p className="mt-4 text-slate-600">{barang.deskripsi}</p>

          <div className="my-6 space-y-2 text-sm text-slate-700">
            <p>
              Harga: <b className="text-slate-900">{formatRupiah(barang.hargaSewa)}/hari</b>
            </p>
            <p>
              Jaminan: <b className="text-slate-900">{formatRupiah(barang.jaminan)}</b>
            </p>
            <p>
              Stok: <b className="text-slate-900">{barang.stok}</b>
            </p>
          </div>

          {barang.stok > 0 ? (
            <>
              <div className="mb-4 flex items-center gap-3">
                <span className="text-sm text-slate-700">Jumlah</span>
                <div className="flex items-center rounded-lg border border-slate-300">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    className="px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-l-lg transition"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-slate-900 font-medium">{qty}</span>
                  <button
                    type="button"
                    onClick={handleIncrement}
                    className="px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-r-lg transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button
                type="button"
                className="w-full"
                onClick={handleAddToCart}
              >
                {added ? "✓ Ditambahkan" : "Tambah ke Keranjang"}
              </Button>

              {added && (
                <button
                  type="button"
                  onClick={() => router.push("/keranjang")}
                  className="mt-3 w-full text-center text-sm font-medium text-blue-600 hover:underline"
                >
                  Lihat keranjang →
                </button>
              )}
            </>
          ) : (
            <p className="font-semibold text-red-600">Stok habis</p>
          )}
        </div>
      </div>
    </div>
  );
}