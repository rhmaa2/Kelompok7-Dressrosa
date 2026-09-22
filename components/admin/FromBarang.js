"use client";

import { useEffect, useState } from "react";
import Tombol from "@/components/ui/Tombol";

const defaultForm = {
  nama: "",
  kategori: "",
  deskripsi: "",
  hargaSewa: 0,
  jaminan: 0,
  stok: 0,
  gambar: "📦",
};

export default function FormBarang({ initial, onSubmit, onCancel }) {
  const [f, setF] = useState(initial || defaultForm);

  useEffect(() => {
    setF(initial || defaultForm);
  }, [initial]);

  const c = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...f,
      nama: f.nama.trim(),
      kategori: f.kategori.trim(),
      deskripsi: f.deskripsi.trim(),
      hargaSewa: Number(f.hargaSewa),
      jaminan: Number(f.jaminan),
      stok: Number(f.stok),
    });

    if (!initial) {
      setF(defaultForm);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
      <input
        required
        name="nama"
        value={f.nama}
        onChange={c}
        placeholder="Nama barang"
        className="rounded-lg border px-3 py-2"
      />

      <input
        required
        name="kategori"
        value={f.kategori}
        onChange={c}
        placeholder="Kategori"
        className="rounded-lg border px-3 py-2"
      />

      <input
        name="hargaSewa"
        type="number"
        min="0"
        value={f.hargaSewa}
        onChange={c}
        placeholder="Harga sewa/hari"
        className="rounded-lg border px-3 py-2"
      />

      <input
        name="jaminan"
        type="number"
        min="0"
        value={f.jaminan}
        onChange={c}
        placeholder="Jaminan"
        className="rounded-lg border px-3 py-2"
      />

      <input
        name="stok"
        type="number"
        min="0"
        value={f.stok}
        onChange={c}
        placeholder="Stok"
        className="rounded-lg border px-3 py-2"
      />

      <input
        name="gambar"
        value={f.gambar}
        onChange={c}
        placeholder="Emoji"
        className="rounded-lg border px-3 py-2"
      />

      <textarea
        name="deskripsi"
        value={f.deskripsi}
        onChange={c}
        placeholder="Deskripsi"
        className="sm:col-span-2 rounded-lg border px-3 py-2"
      />

      <div className="sm:col-span-2 flex gap-2">
        <Tombol type="submit">Simpan</Tombol>
        <Tombol type="button" variant="secondary" onClick={onCancel}>
          Batal
        </Tombol>
      </div>
    </form>
  );
}