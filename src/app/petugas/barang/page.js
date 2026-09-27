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
<<<<<<< HEAD
  const [editingItem, setEditingItem] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const data = getBarang();
    setItems(data || []);
  }, []);

  const handleSave = (formData) => {
    const updatedItems = editingItem
      ? items.map((item) => (item.id === editingItem.id ? { ...editingItem, ...formData } : item))
      : [...items, { ...formData, id: Date.now() }];

    saveBarang(updatedItems);
    setItems(updatedItems);
    handleCloseForm();
  };

  const handleDelete = (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus barang ini?")) return;

    const updatedItems = items.filter((item) => item.id !== id);
    saveBarang(updatedItems);
    setItems(updatedItems);
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingItem(null);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Kelola Barang</h1>
          <p className="text-sm text-slate-500">
            Tambah, ubah, dan hapus data perlengkapan yang tersedia untuk disewa.
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          + Tambah Barang
        </Button>
      </div>

      {isFormOpen && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-800">
            {editingItem ? "Edit Barang" : "Tambah Barang"}
          </h2>
          <FormBarang
            initial={editingItem}
            onSubmit={handleSave}
            onCancel={handleCloseForm}
          />
        </div>
=======
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
>>>>>>> b5af262921bebe0badafcfb6b31722e352043fdd
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
<<<<<<< HEAD
              <th className="p-3 font-semibold">Barang</th>
              <th className="p-3 font-semibold">Kategori</th>
              <th className="p-3 font-semibold">Harga</th>
              <th className="p-3 font-semibold">Stok</th>
              <th className="p-3 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-400">
                  Belum ada data barang.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="p-3">
                    <span className="mr-2">{item.gambar}</span>
                    <span className="font-medium text-slate-800">{item.nama}</span>
                  </td>
                  <td className="p-3 text-slate-600">{item.kategori}</td>
                  <td className="p-3 text-slate-600">{formatRupiah(item.hargaSewa)}</td>
                  <td className="p-3 text-slate-600">{item.stok}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="mr-3 font-medium text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="font-medium text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
=======
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
>>>>>>> b5af262921bebe0badafcfb6b31722e352043fdd
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