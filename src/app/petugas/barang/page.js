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

const KONDISI_LABEL = {
  baik: "Baik",
  rusak_ringan: "Rusak Ringan",
  rusak_berat: "Rusak Berat",
  hilang: "Hilang",
};

export default function PetugasBarang() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    getBarang()
      .then((data) => {
        setItems(data);
      })
      .catch((err) => {
        setError(
          err.message || "Gagal memuat data barang."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredItems = items.filter((item) =>
    `${item.nama} ${item.kategori}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalBarang = items.length;

  const totalStok = items.reduce(
    (total, item) => total + Number(item.stok || 0),
    0
  );

  const stokTersedia = items.reduce(
    (total, item) =>
      total + Number(item.stokTersedia || 0),
    0
  );

  const barangBermasalah = items.filter(
    (item) =>
      item.kondisi === "rusak_ringan" ||
      item.kondisi === "rusak_berat" ||
      item.kondisi === "hilang"
  ).length;

  return (
    <div>
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black">
          Stok & Kondisi Barang
        </h1>

        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
          Halaman ini digunakan petugas untuk melihat
          ketersediaan dan kondisi barang. Petugas tidak
          mengubah data barang secara langsung. Hasil
          pengecekan dapat dilaporkan melalui menu{" "}
          <b>Pengecekan Perlengkapan</b>.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-600">
            {error}
          </p>
        </div>
      )}

      {/* RINGKASAN */}
      {!loading && !error && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">
              Jenis Barang
            </p>

            <p className="mt-1 text-2xl font-black text-slate-900">
              {totalBarang}
            </p>

            <p className="text-xs text-slate-400">
              jenis perlengkapan
            </p>
          </div>

          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">
              Total Stok
            </p>

            <p className="mt-1 text-2xl font-black text-blue-600">
              {totalStok}
            </p>

            <p className="text-xs text-slate-400">
              seluruh stok barang
            </p>
          </div>

          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">
              Stok Tersedia
            </p>

            <p className="mt-1 text-2xl font-black text-green-600">
              {stokTersedia}
            </p>

            <p className="text-xs text-slate-400">
              siap digunakan
            </p>
          </div>

          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">
              Perlu Perhatian
            </p>

            <p className="mt-1 text-2xl font-black text-orange-500">
              {barangBermasalah}
            </p>

            <p className="text-xs text-slate-400">
              rusak atau hilang
            </p>
          </div>
        </div>
      )}

      {/* SEARCH */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama barang atau kategori..."
            className="w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="rounded-xl border bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Reset
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="mt-5 overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b bg-slate-50 px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-bold text-slate-800">
                Daftar Barang
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Menampilkan {filteredItems.length} dari{" "}
                {items.length} barang
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center">
            <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"></div>

            <p className="text-sm text-slate-400">
              Memuat data barang...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-3 font-semibold text-slate-600">
                    Foto
                  </th>

                  <th className="p-3 font-semibold text-slate-600">
                    Barang
                  </th>

                  <th className="p-3 font-semibold text-slate-600">
                    Kategori
                  </th>

                  <th className="p-3 font-semibold text-slate-600">
                    Harga Sewa
                  </th>

                  <th className="p-3 font-semibold text-slate-600">
                    Stok
                  </th>

                  <th className="p-3 font-semibold text-slate-600">
                    Kondisi
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t transition hover:bg-slate-50"
                  >
                    {/* FOTO */}
                    <td className="p-3">
                      {item.foto ? (
                        <img
                          src={item.foto}
                          alt={item.nama}
                          className="h-14 w-14 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                          No Foto
                        </div>
                      )}
                    </td>

                    {/* NAMA */}
                    <td className="p-3">
                      <b className="text-slate-800">
                        {item.nama}
                      </b>
                    </td>

                    {/* KATEGORI */}
                    <td className="p-3">
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                        {item.kategori}
                      </span>
                    </td>

                    {/* HARGA */}
                    <td className="p-3 font-medium text-slate-700">
                      {formatRupiah(item.hargaSewa)}
                    </td>

                    {/* STOK */}
                    <td className="p-3">
                      <span className="font-semibold text-slate-700">
                        {item.stokTersedia}
                      </span>

                      <span className="text-slate-400">
                        /{item.stok}
                      </span>
                    </td>

                    {/* KONDISI */}
                    <td className="p-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          KONDISI_BADGE[item.kondisi] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {KONDISI_LABEL[item.kondisi] ||
                          item.kondisi ||
                          "Tidak diketahui"}
                      </span>
                    </td>
                  </tr>
                ))}

                {!filteredItems.length && (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-10 text-center"
                    >
                      <div className="text-3xl">
                        📦
                      </div>

                      <p className="mt-2 font-semibold text-slate-700">
                        Barang tidak ditemukan
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Coba gunakan kata kunci pencarian
                        yang berbeda.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}