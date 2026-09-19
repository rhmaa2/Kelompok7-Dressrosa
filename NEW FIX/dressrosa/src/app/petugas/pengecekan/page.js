"use client";

import { useEffect, useState } from "react";
import { getPeminjamanLengkap, ubahStatusPeminjaman, buatPengecekan } from "@/lib/store";
import { formatTanggal } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function Pengecekan() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    muat();
  }, []);

  function muat() {
    setLoading(true);
    getPeminjamanLengkap()
      .then(setItems)
      .finally(() => setLoading(false));
  }

  async function ubah(id, status) {
    setBusyId(id);
    try {
      await ubahStatusPeminjaman(id, status);
      muat();
    } finally {
      setBusyId(null);
    }
  }

  async function selesaikanDenganKondisi(p, statusKondisi) {
    setBusyId(p.id);
    try {
      for (const item of p.items) {
        await buatPengecekan({
          peminjamanId: p.id,
          barangId: item.barangId,
          statusKondisi,
          catatan:
            statusKondisi === "baik"
              ? "Kondisi baik dan lengkap"
              : statusKondisi === "rusak"
              ? "Rusak ringan, sebagian jaminan dipotong"
              : "Hilang/rusak berat",
        });
      }
      await ubahStatusPeminjaman(p.id, "selesai");
      muat();
    } finally {
      setBusyId(null);
    }
  }

  const siap = items.filter((p) => p.status === "siap_diambil");
  const dipinjam = items.filter((p) => ["sedang_dipinjam", "terlambat"].includes(p.status));
  const kembali = items.filter((p) => p.status === "dikembalikan");

  return (
    <div>
      <h1 className="text-3xl font-black">Pengecekan Perlengkapan</h1>
      <p className="mt-1 text-sm text-slate-500">
        Konfirmasi serah terima barang dan catat kondisi barang saat dikembalikan.
      </p>

      {loading && <p className="mt-6 text-sm text-slate-400">Memuat...</p>}

      {!loading && (
        <>
          <section className="mt-6">
            <h2 className="mb-3 font-bold">Siap Diambil / Dikirim</h2>
            <div className="space-y-3">
              {siap.map((p) => (
                <div key={p.id} className="rounded-xl border bg-white p-5">
                  <b>#{p.id}</b>
                  <p className="mt-1 text-sm text-slate-500">
                    {p.items.map((i) => `${i.nama} ×${i.qty}`).join(", ")} •{" "}
                    {formatTanggal(p.tanggalMulai)}
                  </p>
                  <Button
                    className="mt-3"
                    disabled={busyId === p.id}
                    onClick={() => ubah(p.id, "sedang_dipinjam")}
                  >
                    Tandai Sudah Diserahkan
                  </Button>
                </div>
              ))}
              {!siap.length && (
                <p className="text-sm text-slate-400">Tidak ada barang yang menunggu serah terima.</p>
              )}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="mb-3 font-bold">Sedang Dipinjam</h2>
            <div className="space-y-3">
              {dipinjam.map((p) => (
                <div key={p.id} className="rounded-xl border bg-white p-5">
                  <b>#{p.id}</b>
                  <p className="mt-1 text-sm text-slate-500">
                    Jatuh tempo {formatTanggal(p.tanggalSelesai)}
                    {p.status === "terlambat" && (
                      <span className="ml-2 font-semibold text-orange-600">Terlambat</span>
                    )}
                  </p>
                  <Button
                    className="mt-3"
                    disabled={busyId === p.id}
                    onClick={() => ubah(p.id, "dikembalikan")}
                  >
                    Tandai Sudah Dikembalikan
                  </Button>
                </div>
              ))}
              {!dipinjam.length && (
                <p className="text-sm text-slate-400">Tidak ada barang yang sedang dipinjam.</p>
              )}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="mb-3 font-bold">Pengecekan Kondisi & Selesaikan</h2>
            <div className="space-y-3">
              {kembali.map((p) => (
                <div key={p.id} className="rounded-xl border bg-white p-5">
                  <b>#{p.id}</b>
                  <p className="mt-1 text-sm text-slate-500">
                    {p.items.map((i) => `${i.nama} ×${i.qty}`).join(", ")}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      disabled={busyId === p.id}
                      onClick={() => selesaikanDenganKondisi(p, "baik")}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      Kondisi Baik
                    </button>
                    <button
                      disabled={busyId === p.id}
                      onClick={() => selesaikanDenganKondisi(p, "rusak")}
                      className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      Rusak Ringan
                    </button>
                    <button
                      disabled={busyId === p.id}
                      onClick={() => selesaikanDenganKondisi(p, "hilang")}
                      className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      Hilang/Rusak Berat
                    </button>
                  </div>
                </div>
              ))}
              {!kembali.length && (
                <p className="text-sm text-slate-400">Tidak ada barang yang menunggu pengecekan kondisi.</p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}