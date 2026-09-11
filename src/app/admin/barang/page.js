"use client";

import { useEffect, useState } from "react";
import { formatRupiah } from "@/lib/utils";
import FormBarang from "@/components/admin/FormBarang";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export default function AdminBarangPage() {
  const [list, setList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  function muatData() {
    fetch("/api/barang")
      .then((res) => res.json())
      .then((data) =>
        setList(Array.isArray(data) ? data.map((b) => ({ ...b, hargaSewa: b.harga_sewa })) : [])
      );
  }

  useEffect(() => {
    muatData();
  }, []);

  function handleTambahBaru() {
    setEditing(null);
    setModalOpen(true);
  }

  function handleEdit(barang) {
    setEditing(barang);
    setModalOpen(true);
  }

  function handleSubmit(data) {
    const request = editing
      ? fetch(`/api/barang/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
      : fetch("/api/barang", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

    request.then(() => {
      muatData();
      setModalOpen(false);
    });
  }

  function handleDelete(id) {
    if (confirm("Hapus barang ini?")) {
      fetch(`/api/barang/${id}`, { method: "DELETE" }).then(muatData);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Kelola Barang</h1>
          <p className="text-sm text-slate-500">Tambah, ubah, atau hapus barang di katalog</p>
        </div>
        <Button className="w-auto px-4" onClick={handleTambahBaru}>
          + Tambah Barang
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Harga Sewa</th>
              <th className="px-4 py-3">Jaminan</th>
              <th className="px-4 py-3">Stok</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map((b) => (
              <tr key={b.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{b.gambar} {b.nama}</td>
                <td className="px-4 py-3">{b.kategori}</td>
                <td className="px-4 py-3">{formatRupiah(b.hargaSewa)}</td>
                <td className="px-4 py-3">{formatRupiah(b.jaminan)}</td>
                <td className="px-4 py-3">{b.stok}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button onClick={() => handleEdit(b)} className="text-emerald-600 hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(b.id)} className="text-red-500 hover:underline">
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Barang" : "Tambah Barang"}>
        <FormBarang
          initialData={editing}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
