"use client";

import { useEffect, useState } from "react";
import FilterBarang from "@/components/barang/FilterBarang";
import BarangList from "@/components/barang/BarangList";
import { getBarang } from "@/lib/store";

export default function BarangPage() {
  const [items, setItems] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getBarang()
      .then((data) => {
        if (mounted) setItems(data);
      })
      .catch((err) => {
        if (mounted) setError(err.message || "Gagal memuat data barang.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const categories = ["Semua", ...new Set(items.map((x) => x.kategori))];

  const filtered = items.filter(
    (x) =>
      (kategori === "Semua" || x.kategori === kategori) &&
      x.nama.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-black">Katalog Barang</h1>
      <p className="mt-1 mb-6 text-sm text-slate-500">
        Cari dan pilih perlengkapan untuk acaramu.
      </p>

      <FilterBarang
        kategoriList={categories}
        kategoriAktif={kategori}
        onKategoriChange={setKategori}
        keyword={keyword}
        onKeywordChange={setKeyword}
      />

      {loading && (
        <p className="rounded-xl border border-dashed p-12 text-center text-slate-400">
          Memuat data dari API...
        </p>
      )}

      {!loading && error && (
        <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </p>
      )}

      {!loading && !error && <BarangList items={filtered} />}
    </div>
  );
}