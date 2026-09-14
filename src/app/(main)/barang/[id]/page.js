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
    setBarang(getBarang().find((x) => String(x.id) === String(id)) || false);
  }, [id]);

  if (barang === null) {
    return <p className="p-12 text-center">Memuat...</p>;
  }

  if (barang === false) {
    return (
      <div className="p-12 text-center">
        Barang tidak ditemukan.{" "}
        <Link href="/barang" className="text-blue-600">
          Kembali
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link href="/barang" className="text-sm text-slate-500">
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
          <h1 className="mt-1 text-3xl font-black">{barang.nama}</h1>
          <p className="mt-4 text-slate-600">{barang.deskripsi}</p>

          <div className="my-6 space-y-2 text-sm">
            <p>
              Harga: <b>{formatRupiah(barang.hargaSewa)}/hari</b>
            </p>
            <p>
              Jaminan: <b>{formatRupiah(barang.jaminan)}</b>
            </p>
            <p>
              Stok: <b>{barang.stok}</b>
            </p>
          </div>

          {barang.stok > 0 ? (
            <>
              <div className="mb-4 flex items-center gap-3">
                <span className="text-sm">Jumlah</span>
                <div className="flex items-center rounded-lg border">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-2"
                  >
                    −
                  </button>
                  <span className="w-8 text-center">{qty}</span>
                  <button
                    onClick={() =>
                      setQty((q) => Math.min(barang.stok, q + 1))
                    }
                    className="px-3 py-2"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() => {
                  addToCart(barang, qty);
                  setAdded(true);
                }}
              >
                {added ? "✓ Ditambahkan" : "Tambah ke Keranjang"}
              </Button>

              {added && (
                <button
                  onClick={() => router.push("/keranjang")}
                  className="mt-3 w-full text-sm text-blue-600"
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