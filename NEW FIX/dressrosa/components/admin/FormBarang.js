"use client";

import { useEffect, useState } from "react";
import Tombol from "@/components/ui/Tombol";

const KONDISI_OPTIONS = ["baik", "rusak", "perbaikan"];

export default function FormBarang({ initial, kategoriList, onSubmit, onCancel }) {
  const defaultForm = {
    nama: "",
    kategoriId: kategoriList?.[0]?.id || "",
    hargaSewa: 0,
    hargaJaminan: 0,
    stok: 0,
    stokTersedia: 0,
    kondisi: "baik",
    foto: "",
    deskripsi: "",
  };

  const [f, setF] = useState(initial || defaultForm);

  useEffect(() => {
    setF(initial || defaultForm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  const c = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...f,
      kategoriId: Number(f.kategoriId),
      hargaSewa: Number(f.hargaSewa),
      hargaJaminan: Number(f.hargaJaminan || 0),
      stok: Number(f.stok),
      stokTersedia: Number(f.stokTersedia || f.stok),
      foto: f.foto?.trim() || "",
      deskripsi: f.deskripsi || "",
    });
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

      <select
        required
        name="kategoriId"
        value={f.kategoriId}
        onChange={c}
        className="rounded-lg border px-3 py-2"
      >
        <option value="">Pilih kategori</option>
        {(kategoriList || []).map((k) => (
          <option key={k.id} value={k.id}>
            {k.nama}
          </option>
        ))}
      </select>

      <input
        name="hargaSewa"
        type="number"
        value={f.hargaSewa}
        onChange={c}
        placeholder="Harga sewa/hari"
        className="rounded-lg border px-3 py-2"
      />

      <select
        name="kondisi"
        value={f.kondisi}
        onChange={c}
        className="rounded-lg border px-3 py-2"
      >
        {KONDISI_OPTIONS.map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>

      <input
        name="stok"
        type="number"
        value={f.stok}
        onChange={c}
        placeholder="Stok total"
        className="rounded-lg border px-3 py-2"
      />

      <input
        name="stokTersedia"
        type="number"
        value={f.stokTersedia}
        onChange={c}
        placeholder="Stok tersedia"
        className="rounded-lg border px-3 py-2"
      />

      <input
        name="hargaJaminan"
        type="number"
        value={f.hargaJaminan}
        onChange={c}
        placeholder="Harga jaminan (opsional)"
        className="rounded-lg border px-3 py-2"
      />

      <input
        name="foto"
        value={f.foto}
        onChange={c}
        placeholder="URL foto (opsional, kosongkan untuk pakai gambar otomatis)"
        className="rounded-lg border px-3 py-2 sm:col-span-2"
      />

      <textarea
        name="deskripsi"
        value={f.deskripsi}
        onChange={c}
        placeholder="Deskripsi (opsional)"
        rows={2}
        className="rounded-lg border px-3 py-2 sm:col-span-2"
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