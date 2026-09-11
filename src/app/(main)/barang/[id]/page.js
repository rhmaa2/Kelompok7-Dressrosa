"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { addToCart } from "@/lib/cart";
import Button from "@/components/ui/Button";

export default function DetailBarangPage({ params }) {
  const router = useRouter();
  const [barang, setBarang] = useState(undefined);

  useEffect(() => {
    fetch(`/api/barang/${params.id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setBarang(data ? { ...data, hargaSewa: data.harga_sewa } : null));
  }, [params.id]);

  const [qty, setQty] = useState(1);
  const [ditambahkan, setDitambahkan] = useState(false);

  if (barang === undefined) {
    return <p className="py-16 text-center text-sm text-slate-400">Memuat...</p>;
  }

  if (!barang) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-slate-500">
        Barang tidak ditemukan.{" "}
        <Link href="/barang" className="text-emerald-600 hover:underline">
          Kembali ke katalog
        </Link>
      </div>
    );
  }

  function handleTambah() {
    addToCart(barang, qty);
    setDitambahkan(true);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/barang" className="mb-4 inline-block text-sm text-slate-500 hover:text-emerald-600">
        ← Kembali ke katalog
      </Link>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex h-64 items-center justify-center rounded-xl bg-slate-100 text-7xl">
          {barang.gambar}
        </div>

        <div>
          <p className="text-sm text-slate-500">{barang.kategori}</p>
          <h1 className="mb-2 text-2xl font-bold text-slate-800">{barang.nama}</h1>
          <p className="mb-4 text-sm text-slate-600">{barang.deskripsi}</p>

          <div className="mb-4 space-y-1 text-sm">
            <p>
              <span className="text-slate-500">Harga sewa: </span>
              <span className="font-medium text-emerald-600">{formatRupiah(barang.hargaSewa)}/hari</span>
            </p>
            <p>
              <span className="text-slate-500">Jaminan: </span>
              <span className="font-medium">{formatRupiah(barang.jaminan)}</span>
            </p>
            <p>
              <span className="text-slate-500">Stok tersedia: </span>
              <span className="font-medium">{barang.stok}</span>
            </p>
          </div>

          {barang.stok === 0 ? (
            <p className="text-sm font-medium text-red-500">Stok sedang habis</p>
          ) : (
            <>
              <div className="mb-4 flex items-center gap-3">
                <label className="text-sm text-slate-600">Jumlah:</label>
                <div className="flex items-center rounded-lg border border-slate-300">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 text-slate-500 hover:bg-slate-50"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(barang.stok, q + 1))}
                    className="px-3 py-1 text-slate-500 hover:bg-slate-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button onClick={handleTambah}>
                {ditambahkan ? "✓ Ditambahkan ke Keranjang" : "Tambah ke Keranjang"}
              </Button>

              {ditambahkan && (
                <button
                  onClick={() => router.push("/keranjang")}
                  className="mt-2 w-full text-center text-sm text-emerald-600 hover:underline"
                >
                  Lihat Keranjang →
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
