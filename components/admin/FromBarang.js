"use client";

import { useEffect, useState } from "react";
import Tombol from "@/components/ui/Tombol";

const KONDISI_OPTIONS = ["baik", "rusak", "perbaikan"];

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100";

function Field({ label, children, span2 }) {
  return (
    <label className={`block text-xs font-semibold text-slate-500 ${span2 ? "sm:col-span-2" : ""}`}>
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

export default function FormBarang({ initial, kategoriList, onSubmit, onCancel, submitting }) {
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
    // memberitahu ESLint agar tidak memberikan peringatan pada baris dependency useEffect berikutnya
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);
  //...f spread operator, tujuannya menyalin semua data lama
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
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <Field label="Nama barang" span2>
        <input required name="nama" value={f.nama} onChange={c} placeholder="Contoh: Tenda 4x6" className={inputCls} />
      </Field>

      <Field label="Kategori">
        <select required name="kategoriId" value={f.kategoriId} onChange={c} className={inputCls}>
          <option value="">Pilih kategori</option>
          {(kategoriList || []).map((k) => (
            <option key={k.id} value={k.id}>
              {k.nama}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Kondisi">
        <select name="kondisi" value={f.kondisi} onChange={c} className={inputCls}>
          {KONDISI_OPTIONS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Harga sewa / hari (Rp)">
        <input name="hargaSewa" type="number" min="0" value={f.hargaSewa} onChange={c} placeholder="150000" className={inputCls} />
      </Field>

      <Field label="Harga jaminan (Rp)">
        <input name="hargaJaminan" type="number" min="0" value={f.hargaJaminan} onChange={c} placeholder="0" className={inputCls} />
      </Field>

      <Field label="Stok total">
        <input name="stok" type="number" min="0" value={f.stok} onChange={c} placeholder="0" className={inputCls} />
      </Field>

      <Field label="Stok tersedia">
        <input name="stokTersedia" type="number" min="0" value={f.stokTersedia} onChange={c} placeholder="0" className={inputCls} />
      </Field>

      <Field label="URL foto (opsional)" span2>
        <input name="foto" value={f.foto} onChange={c} placeholder="Kosongkan untuk gambar otomatis" className={inputCls} />
      </Field>

      <Field label="Deskripsi (opsional)" span2>
        <textarea name="deskripsi" value={f.deskripsi} onChange={c} placeholder="Deskripsi singkat barang" rows={3} className={inputCls} />
      </Field>

      <div className="flex gap-2 sm:col-span-2">
        <Tombol type="submit" disabled={submitting}>
          {submitting ? "Menyimpan..." : "Simpan"}
        </Tombol>
        <Tombol type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Batal
        </Tombol>
      </div>
    </form>
  );
}