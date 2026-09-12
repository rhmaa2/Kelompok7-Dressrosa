"use client";

import { useEffect, useState } from "react";
import { getBarang, saveBarang } from "@/lib/store";
import { formatRupiah } from "@/lib/utils";
import FormBarang from "@/components/admin/FormBarang";
import Button from "@/components/ui/Button";

export default function AdminBarang() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setItems(getBarang());
  }, []);

  function submit(data) {
    const next = editing
      ? items.map((x) => (x.id === editing.id ? { ...editing, ...data } : x))
      : [...items, { ...data, id: Date.now() }];

    saveBarang(next);
    setItems(next);
    setEditing(null);
    setShow(false);
  }

  function hapus(id) {
    if (!confirm("Hapus barang ini?")) return;
    const next = items.filter((x) => x.id !== id);
    saveBarang(next);
    setItems(next);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black">Kelola Barang</h1>
          <p className="text-sm text-slate-500">
            CRUD UI dengan state dan localStorage.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setShow(true);
          }}
        >
          + Tambah Barang
        </Button>
      </div>

      {show && (
        <div className="mt-5 rounded-xl border bg-white p-5">
          <h2 className="mb-4 font-bold">
            {editing ? "Edit Barang" : "Tambah Barang"}
          </h2>
          <FormBarang
            initial={editing}
            onSubmit={submit}
            onCancel={() => setShow(false)}
          />
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3">Barang</th>
              <th className="p-3">Kategori</th>
              <th className="p-3">Harga</th>
              <th className="p-3">Stok</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((x) => (
              <tr key={x.id} className="border-t">
                <td className="p-3">
                  {x.gambar} <b>{x.nama}</b>
                </td>
                <td className="p-3">{x.kategori}</td>
                <td className="p-3">{formatRupiah(x.hargaSewa)}</td>
                <td className="p-3">{x.stok}</td>
                <td className="p-3">
                  <button
                    onClick={() => {
                      setEditing(x);
                      setShow(true);
                    }}
                    className="mr-3 text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => hapus(x.id)}
                    className="text-red-600"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}