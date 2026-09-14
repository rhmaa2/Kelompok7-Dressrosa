"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPengajuan, savePengajuan } from "@/lib/store";
import { formatRupiah, formatTanggal, statusLabel } from "@/lib/utils";

const ALUR = [
  { key: "PENDING", cocok: ["PENDING"] },
  { key: "APPROVED", cocok: ["APPROVED"] },
  { key: "DIPROSES", cocok: ["DIPROSES"] },
  { key: "SIAP", cocok: ["SIAP_DIAMBIL", "SIAP_DIKIRIM"] },
  { key: "SEDANG_DI_SEWA", cocok: ["SEDANG_DI_SEWA"] },
  { key: "DIKEMBALIKAN", cocok: ["DIKEMBALIKAN"] },
  { key: "COMPLETED", cocok: ["COMPLETED"] },
];

const STATUS_BERHENTI = ["REJECTED", "CANCELLED"];

export default function StatusDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);

  useEffect(() => {
    const found = getPengajuan().find((x) => String(x.id) === String(id));
    setP(found || false);
  }, [id]);

  if (p === null) {
    return <p className="p-12 text-center text-slate-400">Memuat...</p>;
  }
  if (p === false) {
    return (
      <p className="p-12 text-center text-slate-400">
        Pengajuan tidak ditemukan.
      </p>
    );
  }

  const dihentikan = STATUS_BERHENTI.includes(p.status);
  const langkahAktif = ALUR.findIndex((s) => s.cocok.includes(p.status));

  function labelUntuk(key) {
    if (key === "SIAP") {
      return p.metode === "antar" ? statusLabel.SIAP_DIKIRIM : statusLabel.SIAP_DIAMBIL;
    }
    return statusLabel[key] || key;
  }

  function updateStatus(patch) {
    const next = getPengajuan().map((x) =>
      x.id === p.id ? { ...x, ...patch } : x
    );
    savePengajuan(next);
    setP({ ...p, ...patch });
  }

  function batalkan() {
    updateStatus({ status: "CANCELLED" });
  }


  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/status" className="text-sm text-slate-500 hover:text-slate-700">
        ← Status
      </Link>

      <div className="mt-4 overflow-hidden rounded-2xl border bg-white shadow-sm">
        {/* Header */}
        <div className="border-b bg-slate-50 px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-400">
                Pengajuan #{p.id}
              </p>
              <h1 className="text-2xl font-black text-slate-900">
                Detail Peminjaman
              </h1>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                dihentikan
                  ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {statusLabel[p.status] || p.status}
            </span>
          </div>
        </div>

        <div className="px-6 py-6">
          {/* Daftar barang */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Barang disewa
            </p>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              {p.items.map((i) => (
                <li key={i.barangId || i.nama} className="flex justify-between">
                  <span>
                    {i.nama} × {i.qty}
                  </span>
                  <span className="text-slate-500">
                    {formatRupiah(i.hargaSewa * i.qty)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Timeline */}
          {dihentikan ? (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Pengajuan ini {p.status === "CANCELLED" ? "sudah dibatalkan" : "ditolak"}
              {" "}dan tidak akan diproses lebih lanjut.
            </div>
          ) : (
            <div className="mt-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Progres pengajuan
              </p>
              <div className="relative pl-2">
                {ALUR.map((step, i) => {
                  const selesai = i <= langkahAktif;
                  const terakhir = i === ALUR.length - 1;
                  return (
                    <div key={step.key} className="relative flex gap-4 pb-7 last:pb-0">
                      {!terakhir && (
                        <span
                          className={`absolute left-[9px] top-5 h-full w-0.5 ${
                            i < langkahAktif ? "bg-blue-500" : "bg-slate-200"
                          }`}
                        />
                      )}
                      <span
                        className={`z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                          selesai ? "bg-blue-600" : "bg-slate-300"
                        }`}
                      >
                        {i < langkahAktif ? "✓" : ""}
                      </span>
                      <div>
                        <p
                          className={`text-sm font-semibold ${
                            selesai ? "text-slate-900" : "text-slate-400"
                          }`}
                        >
                          {labelUntuk(step.key)}
                        </p>
                        {step.key === "PENDING" && (
                          <p className="text-xs text-slate-400">
                            Pengajuan dibuat {formatTanggal(p.createdAt || p.id)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ringkasan */}
          <div className="mt-7 grid gap-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
            <p>
              Mulai <b className="block text-slate-800">{formatTanggal(p.tanggalMulai)}</b>
            </p>
            <p>
              Selesai <b className="block text-slate-800">{formatTanggal(p.tanggalSelesai)}</b>
            </p>
            <p>
              Metode <b className="block capitalize text-slate-800">{p.metode === "antar" ? "Diantar" : "Ambil sendiri"}</b>
            </p>
            <p>
              Total <b className="block text-slate-800">{formatRupiah(p.totalBayar)}</b>
            </p>
          </div>

          {/* Aksi */}
          {p.status === "APPROVED" && !p.sudahBayar && (
            <Link
              href={`/pembayaran/${p.id}`}
              className="mt-5 block w-full rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
            >
              Bayar Sekarang
            </Link>
          )}

          {["PENDING", "APPROVED"].includes(p.status) && (
            <button
              onClick={batalkan}
              className="mt-3 w-full text-sm font-medium text-red-500 hover:text-red-600"
            >
              Batalkan pengajuan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

