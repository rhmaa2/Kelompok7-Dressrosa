"use client";

import { useEffect, useState } from "react";
import { getPengajuan, savePengajuan } from "@/lib/store";
import { formatTanggal } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function Pengecekan() {
  const [items, setItems] = useState([]);
  const [notes, setNotes] = useState({});


  useEffect(() => {
    setItems(getPengajuan());
  }, []);

  function update(id, patch) {
    const next = items.map((p) => (p.id === id ? { ...p, ...patch } : p));
    savePengajuan(next);
    setItems(next);
  }
  const keluar = items.filter((p) => p.status === "DIPROSES");
  const siap = items.filter((p) =>
    ["SIAP_DIAMBIL", "SIAP_DIKIRIM"].includes(p.status)
  );
  const disewa = items.filter((p) => p.status === "SEDANG_DI_SEWA");
  const kembali = items.filter((p) => p.status === "DIKEMBALIKAN");

  return (
    <div>
      <h1 className="text-3xl font-black">Pengecekan Perlengkapan</h1>
      <p className="mt-1 text-sm text-slate-500">
        Cek kondisi sebelum keluar, konfirmasi saat terkirim/diambil, saat
        dikembalikan, dan finalisasi kondisi akhir.
      </p>

      {/* 1. Barang keluar -> siapkan & tandai siap diambil/dikirim */}
      <section className="mt-6">
        <h2 className="mb-3 font-bold">Barang Keluar</h2>
        <div className="space-y-3">
          {keluar.map((p) => (
            <div key={p.id} className="rounded-xl border bg-white p-5">
              <b>
                #{p.id} — {p.userNama}
              </b>
              <p className="mt-1 text-sm text-slate-500">
                {p.items.map((i) => `${i.nama} ×${i.qty}`).join(", ")} •{" "}
                {formatTanggal(p.tanggalMulai)}
              </p>
              <textarea
                value={notes[p.id] || ""}
                onChange={(e) =>
                  setNotes({ ...notes, [p.id]: e.target.value })
                }
                placeholder="Catatan kondisi awal"
                className="mt-3 w-full rounded-lg border p-2 text-sm"
              />
              <Button
                className="mt-3"
                onClick={() =>
                  update(p.id, {
                    status: p.metode === "antar" ? "SIAP_DIKIRIM" : "SIAP_DIAMBIL",
                    kondisiAwal: notes[p.id] || "Baik dan lengkap",
                  })
                }
              >
                Tandai Siap
              </Button>
            </div>
          ))}
          {!keluar.length && (
            <p className="text-sm text-slate-400">Tidak ada barang keluar.</p>
          )}
        </div>
      </section>

      {/* 2. Barang siap -> konfirmasi sudah terkirim/diambil oleh penyewa */}
      <section className="mt-8">
        <h2 className="mb-3 font-bold">Barang Terkirim / Diambil</h2>
        <div className="space-y-3">
          {siap.map((p) => (
            <div key={p.id} className="rounded-xl border bg-white p-5">
              <b>
                #{p.id} — {p.userNama}
              </b>
              <p className="mt-1 text-sm text-slate-500">
                {p.items.map((i) => `${i.nama} ×${i.qty}`).join(", ")} •{" "}
                {p.metode === "antar" ? "Diantar ke penyewa" : "Diambil sendiri"}
              </p>
              <Button
                className="mt-3"
                onClick={() => update(p.id, { status: "SEDANG_DI_SEWA" })}
              >
                {p.metode === "antar"
                  ? "Tandai Sudah Terkirim"
                  : "Tandai Sudah Diambil"}
              </Button>
            </div>
          ))}
          {!siap.length && (
            <p className="text-sm text-slate-400">
              Tidak ada barang yang menunggu pengiriman/pengambilan.
            </p>
          )}
        </div>
      </section>

      {/* 3. Barang sedang disewa -> konfirmasi sudah dikembalikan penyewa */}
      <section className="mt-8">
        <h2 className="mb-3 font-bold">Konfirmasi Pengembalian</h2>
        <div className="space-y-3">
          {disewa.map((p) => (
            <div key={p.id} className="rounded-xl border bg-white p-5">
              <b>
                #{p.id} — {p.userNama}
              </b>
              <p className="mt-1 text-sm text-slate-500">
                Jatuh tempo {formatTanggal(p.tanggalSelesai)}
              </p>
              <Button
                className="mt-3"
                onClick={() => update(p.id, { status: "DIKEMBALIKAN" })}
              >
                Tandai Sudah Dikembalikan
              </Button>
            </div>
          ))}
          {!disewa.length && (
            <p className="text-sm text-slate-400">
              Tidak ada barang yang sedang disewa.
            </p>
          )}
        </div>
      </section>

      {/* 4. Barang sudah dikembalikan -> cek kondisi & selesaikan pengajuan */}
      <section className="mt-8">
        <h2 className="mb-3 font-bold">Pengecekan Kondisi & Selesaikan</h2>
        <div className="space-y-3">
          {kembali.map((p) => (
            <div key={p.id} className="rounded-xl border bg-white p-5">
              <b>
                #{p.id} — {p.userNama}
              </b>
              <p className="mt-1 text-sm text-slate-500">
                {p.items.map((i) => `${i.nama} ×${i.qty}`).join(", ")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    update(p.id, {
                      status: "COMPLETED",
                      kondisiAkhir: "Baik, jaminan dikembalikan penuh",
                    })
                  }
                  className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white"
                >
                  Kondisi Baik
                </button>
                <button
                  onClick={() =>
                    update(p.id, {
                      status: "COMPLETED",
                      kondisiAkhir: "Rusak ringan, sebagian jaminan dipotong",
                    })
                  }
                  className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-white"
                >
                  Rusak Ringan
                </button>
                <button
                  onClick={() =>
                    update(p.id, {
                      status: "COMPLETED",
                      kondisiAkhir:
                        "Hilang/rusak berat, jaminan tidak dikembalikan",
                    })
                  }
                  className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white"
                >
                  Hilang/Rusak Berat
                </button>
              </div>
            </div>
          ))}
          {!kembali.length && (
            <p className="text-sm text-slate-400">
              Tidak ada barang yang menunggu pengecekan kondisi.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
