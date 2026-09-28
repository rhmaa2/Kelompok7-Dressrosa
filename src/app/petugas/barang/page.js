"use client";

import { useEffect, useState } from "react";
import { getBarang } from "@/lib/store";
import { formatRupiah } from "@/lib/utils";

const KONDISI_BADGE = {
  baik: "bg-green-100 text-green-700",
  rusak_ringan: "bg-amber-100 text-amber-700",
  rusak_berat: "bg-orange-100 text-orange-700",
  hilang: "bg-red-100 text-red-700",
};

export default function PetugasBarang() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getBarang()
      .then(setItems)
      .catch((err) => setError(err.message || "Gagal memuat data."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-black">Stok & Kondisi Barang</h1>
      <p className="mt-1 text-sm text-slate-500">
        Halaman ini hanya untuk melihat stok dan kondisi barang. Petugas tidak
        mengubah data barang di sini — laporkan hasil pengecekan lewat menu
        <b> Pengecekan Perlengkapan</b>, dan admin yang akan memperbarui stok
        berdasarkan laporan tersebut.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3">Foto</th>
              <th className="p-3">Barang</th>
              <th className="p-3">Kategori</th>
              <th className="p-3">Harga</th>
              <th className="p-3">Stok Tersedia</th>
              <th className="p-3">Kondisi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((x) => (
              <tr key={x.id} className="border-t">
                <td className="p-3">
                  <img
                    src={x.foto}
                    alt={x.nama}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                </td>
                <td className="p-3"><b>{x.nama}</b></td>
                <td className="p-3">{x.kategori}</td>
                <td className="p-3">{formatRupiah(x.hargaSewa)}</td>
                <td className="p-3">{x.stokTersedia}/{x.stok}</td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${
                      KONDISI_BADGE[x.kondisi] || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {x.kondisi}
                  </span>
                </td>
              </tr>
            ))}

            {!loading && !items.length && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-400">
                  Belum ada barang.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {loading && (
          <p className="p-6 text-center text-sm text-slate-400">Memuat...</p>
        )}
      </div>
    </div>
  );
}