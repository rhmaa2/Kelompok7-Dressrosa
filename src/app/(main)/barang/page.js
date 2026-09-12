"use client";

import { useEffect, useState } from "react";
import FilterBarang from "@/components/barang/FilterBarang";
import BarangList from "@/components/barang/BarangList";
import { getBarang, seedStore } from "@/lib/store";

export default function BarangPage() {
  const [items, setItems] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [kategori, setKategori] = useState("Semua");

  useEffect(() => {
    seedStore();
    setItems(getBarang());
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
      <BarangList items={filtered} />
    </div>
  );
}