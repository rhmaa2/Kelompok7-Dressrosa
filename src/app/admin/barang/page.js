"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Tombol from "@/components/ui/Tombol";
import Modal from "@/components/ui/Modal";
import FormBarang from "@/components/admin/FormBarang";
import {
  getBarang,
  getKategori,
  createBarang,
  updateBarang,
  deleteBarang,
} from "@/lib/store";
import { formatRupiah } from "@/lib/utils";

const KONDISI_BADGE = {
  baik: "bg-emerald-100 text-emerald-700",
  rusak: "bg-red-100 text-red-700",
  perbaikan: "bg-amber-100 text-amber-700",
};

export default function AdminBarangPage() {
  const [items, setItems] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const [keyword, setKeyword] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("Semua");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [hapusTarget, setHapusTarget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    muat();
  }, []);

  async function muat() {
    setLoading(true);
    setError("");
    try {
      const [b, k] = await Promise.all([getBarang(), getKategori()]);
      setItems(b);
      setKategoriList(k);
    } catch (err) {
      setError(err.message || "Gagal memuat data barang dari API");
    } finally {
      setLoading(false);
    }
  }

  function bukaTambah() {
    setEditing(null);
    setInfo("");
    setModalOpen(true);
  }

  function bukaEdit(item) {
    setEditing(item);
    setInfo("");
    setModalOpen(true);
  }

  async function simpan(data) {
    setSubmitting(true);
    setError("");
    try {
      if (editing) {
        await updateBarang(editing.id, data);
        setInfo("Barang berhasil diperbarui.");
      } else {
        await createBarang(data);
        setInfo("Barang baru berhasil ditambahkan ke katalog.");
      }
      setModalOpen(false);
      setEditing(null);
      await muat();
    } catch (err) {
      setError(err.message || "Gagal menyimpan data barang ke API.");
    } finally {
      setSubmitting(false);
    }
  }

  async function hapus() {
    if (!hapusTarget) return;
    setDeletingId(hapusTarget.id);
    setError("");
    try {
      await deleteBarang(hapusTarget.id);
      setInfo("Barang berhasil dihapus.");
      setHapusTarget(null);
      await muat();
    } catch (err) {
      setError(err.message || "Gagal menghapus barang.");
    } finally {
      setDeletingId(null);
    }
  }

  const kategoriNama = useMemo(
    () => ["Semua", ...new Set(items.map((x) => x.kategori))],
    [items]
  );

  const filtered = items.filter(
    (x) =>
      (kategoriFilter === "Semua" || x.kategori === kategoriFilter) &&
      x.nama.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Kelola <span className="gradient-text">Barang</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Tambah, ubah, dan hapus perlengkapan pada katalog. Perubahan langsung tersimpan lewat API.
          </p>
        </div>
        <Tombol onClick={bukaTambah}>+ Tambah Barang</Tombol>
      </div>

      {error && (
        <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}
      {info && !error && (
        <p className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          {info}
        </p>
      )}

      <div className="mt-5 grid gap-3 md:grid-cols-[1fr_220px]">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Cari nama barang..."
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
        />
        <select
          value={kategoriFilter}
          onChange={(e) => setKategoriFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
        >
          {kategoriNama.map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-slate-400">Memuat data dari API...</p>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="p-3">Barang</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Harga / hari</th>
                <th className="p-3">Jaminan</th>
                <th className="p-3">Stok</th>
                <th className="p-3">Kondisi</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-t border-slate-100 transition hover:bg-indigo-50/30">
                  <td className="flex items-center gap-3 p-3">
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      {b.foto ? (
                        <img src={b.foto} alt={b.nama} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-lg text-slate-300">📦</div>
                      )}
                    </div>
                    <span className="font-semibold text-slate-800">{b.nama}</span>
                  </td>
                  <td className="p-3 text-slate-600">{b.kategori}</td>
                  <td className="p-3 font-medium text-slate-800">{formatRupiah(b.hargaSewa)}</td>
                  <td className="p-3 text-slate-600">{formatRupiah(b.hargaJaminan)}</td>
                  <td className="p-3 text-slate-600">
                    {b.stokTersedia}/{b.stok}
                  </td>
                  <td className="p-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${KONDISI_BADGE[b.kondisi] || "bg-slate-100 text-slate-600"}`}>
                      {b.kondisi}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => bukaEdit(b)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50"
                      >
                        Ubah
                      </button>
                      <button
                        onClick={() => setHapusTarget(b)}
                        disabled={deletingId === b.id}
                        className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-40"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!filtered.length && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-sm text-slate-400">
                    Belum ada barang yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editing ? "Ubah Barang" : "Tambah Barang"}
        onClose={() => !submitting && setModalOpen(false)}
      >
        <FormBarang
          initial={editing}
          kategoriList={kategoriList}
          onSubmit={simpan}
          onCancel={() => setModalOpen(false)}
          submitting={submitting}
        />
      </Modal>

      <Modal
        open={!!hapusTarget}
        title="Hapus Barang"
        onClose={() => !deletingId && setHapusTarget(null)}
      >
        <p className="text-sm text-slate-600">
          Yakin ingin menghapus <b>{hapusTarget?.nama}</b> dari katalog? Tindakan ini tidak bisa dibatalkan.
        </p>
        <div className="mt-5 flex gap-2">
          <Tombol variant="danger" onClick={hapus} disabled={!!deletingId}>
            {deletingId ? "Menghapus..." : "Ya, Hapus"}
          </Tombol>
          <Tombol variant="secondary" onClick={() => setHapusTarget(null)} disabled={!!deletingId}>
            Batal
          </Tombol>
        </div>
      </Modal>
    </div>
  );
}