"use client";

import { useEffect, useState } from "react";
import FilterBarang from "@/components/barang/FilterBarang";
import BarangList from "@/components/barang/BarangList";

export default function BarangPage() {
  const [daftarBarang, setDaftarBarang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kategoriAktif, setKategoriAktif] = useState("Semua");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    fetch("/api/barang")
      .then((res) => res.json())
      .then((data) => {
        const mapped = Array.isArray(data)
          ? data.map((b) => ({ ...b, hargaSewa: b.harga_sewa }))
          : [];
        setDaftarBarang(mapped);
      })
      .finally(() => setLoading(false));
  }, []);

  const kategoriList = ["Semua", ...new Set(daftarBarang.map((b) => b.kategori))];

  const hasilFilter = daftarBarang.filter((barang) => {
    const cocokKategori = kategoriAktif === "Semua" || barang.kategori === kategoriAktif;
    const cocokKeyword = barang.nama.toLowerCase().includes(keyword.toLowerCase());
    return cocokKategori && cocokKeyword;
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold text-slate-800">Katalog Barang</h1>
      <p className="mb-6 text-sm text-slate-500">
        Pilih perlengkapan yang kamu butuhkan untuk acaramu
      </p>

      <FilterBarang
        kategoriList={kategoriList}
        kategoriAktif={kategoriAktif}
        onKategoriChange={setKategoriAktif}
        keyword={keyword}
        onKeywordChange={setKeyword}
      />

      {loading ? (
        <p className="py-12 text-center text-sm text-slate-400">Memuat barang...</p>
      ) : (
        <BarangList items={hasilFilter} />
      )}
    </div>
  );
}
