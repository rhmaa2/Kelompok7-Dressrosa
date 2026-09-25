"use client";

import { useEffect, useState } from "react";
import { getBarang, saveBarang } from "@/lib/store";
import { formatRupiah } from "@/lib/utils";
import FormBarang from "@/components/admin/FormBarang";
import Button from "@/components/ui/Button";

export default function AdminBarang() {
  const [items, setItems] = useState([]);
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
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
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
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}