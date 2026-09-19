"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { getBarangById } from "@/lib/store";
import { addToCart } from "@/lib/cart";
import { formatRupiah } from "@/lib/utils";

const KONDISI_LABEL = { baik: "Baik", rusak: "Rusak", perbaikan: "Perbaikan" };

export default function DetailBarangPage() {
  const { id } = useParams();
  const router = useRouter();
  const [barang, setBarang] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    getBarangById(id)
      .then((data) => {
        if (mounted) setBarang(data || false);
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message || "Gagal memuat barang.");
          setBarang(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  if (barang === null) {
    return <p className="p-12 text-center">Memuat...</p>;
  }

  if (barang === false) {
    return (
      <div className="p-12 text-center">
        {error || "Barang tidak ditemukan."}{" "}
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
        <div className="h-80 overflow-hidden rounded-2xl bg-slate-100">
          {barang.foto ? (
            <img src={barang.foto} alt={barang.nama} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-7xl text-slate-300">📦</div>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold text-blue-600">
            {barang.kategori}
          </p>
          <h1 className="mt-1 text-3xl font-black">{barang.nama}</h1>
          <p className="mt-4 text-slate-600">
            Kondisi barang saat ini: {KONDISI_LABEL[barang.kondisi] || barang.kondisi}.
          </p>

          <div className="my-6 space-y-2 text-sm">
            <p>
              Harga: <b>{formatRupiah(barang.hargaSewa)}/hari</b>
            </p>
            <p>
              Stok tersedia: <b>{barang.stokTersedia}</b>
            </p>
          </div>

          {barang.stokTersedia > 0 ? (
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
                      setQty((q) => Math.min(barang.stokTersedia, q + 1))
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