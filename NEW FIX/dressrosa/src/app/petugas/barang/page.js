"use client";

import { useEffect, useState } from "react";
import { getBarang, getKategori, createBarang, updateBarang, deleteBarang } from "@/lib/store";
import { formatRupiah } from "@/lib/utils";
import FormBarang from "@/components/admin/FormBarang";
import Button from "@/components/ui/Button";

export default function AdminBarang() {
  const [items, setItems] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    muat();
  }, []);

  function muat() {
    setLoading(true);
    Promise.all([getBarang(), getKategori()])
      .then(([b, k]) => {
        setItems(b);
        setKategoriList(k);
      })
      .catch((err) => setError(err.message || "Gagal memuat data."))
      .finally(() => setLoading(false));
  }

  async function submit(data) {
    setError("");
    try {
      if (editing) {
        await updateBarang(editing.id, data);
      } else {
        await createBarang(data);
      }
      setEditing(null);
      setShow(false);
      muat();
    } catch (err) {
      setError(err.message || "Gagal menyimpan barang.");
    }
  }

  async function hapus(id) {
    if (!confirm("Hapus barang ini?")) return;
    try {
      await deleteBarang(id);
      muat();
    } catch (err) {
      setError(err.message || "Gagal menghapus barang.");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black">Kelola Barang</h1>
          <p className="text-sm text-slate-500">
            Tambah, ubah, dan hapus data perlengkapan yang tersedia untuk disewa.
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

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      {show && (
        <div className="mt-5 rounded-xl border bg-white p-5">
          <h2 className="mb-4 font-bold">
            {editing ? "Edit Barang" : "Tambah Barang"}
          </h2>
          <FormBarang
            initial={editing}
            kategoriList={kategoriList}
            onSubmit={submit}
            onCancel={() => setShow(false)}
          />
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3">Foto</th>
              <th className="p-3">Barang</th>
              <th className="p-3">Kategori</th>
              <th className="p-3">Harga</th>
              <th className="p-3">Stok</th>
              <th className="p-3">Kondisi</th>
              <th className="p-3">Aksi</th>
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
                <td className="p-3">
                  <b>{x.nama}</b>
                </td>
                <td className="p-3">{x.kategori}</td>
                <td className="p-3">{formatRupiah(x.hargaSewa)}</td>
                <td className="p-3">{x.stokTersedia}/{x.stok}</td>
                <td className="p-3 capitalize">{x.kondisi}</td>
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

            {!loading && !items.length && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-400">
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