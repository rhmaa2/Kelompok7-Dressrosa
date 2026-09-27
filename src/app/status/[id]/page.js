"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPeminjamanLengkap, ubahStatusPeminjaman, getCurrentUser } from "@/lib/store";
import { WA_ADMIN, linkWA, pesanKeAdmin } from "@/lib/whatsapp";
import { formatRupiah, formatTanggal, statusLabel, labelStatusPeminjaman } from "@/lib/utils";

const ALUR = [
  { key: "menunggu_persetujuan" },
  { key: "disetujui" },
  { key: "menunggu_verifikasi", label: "Menunggu Verifikasi Pembayaran" },
  { key: "siap_diambil" },
  { key: "sedang_dipinjam" },
  { key: "dikembalikan" },
  { key: "diperiksa" },
  { key: "selesai" },
];

const STATUS_BERHENTI = ["ditolak", "dibatalkan"];

export default function StatusDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [busy, setBusy] = useState(false);
  const [errBatal, setErrBatal] = useState("");

  useEffect(() => {
    let mounted = true;
    getPeminjamanLengkap()
      .then((data) => {
        if (!mounted) return;
        const found = data.find((x) => String(x.id) === String(id));
        setP(found || false);
      })
      .catch(() => mounted && setP(false));
    return () => {
      mounted = false;
    };
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
  const kunciAktif =
    p.status === "terlambat"
      ? "sedang_dipinjam"
      : p.status === "disetujui" && p.sudahBayar
      ? "menunggu_verifikasi"
      : p.status;
  const indexAlur = ALUR.findIndex((s) => s.key === kunciAktif);
  // Status tidak dikenal -> anggap tahap pertama (Menunggu Persetujuan).
  const langkahAktif = indexAlur < 0 ? 0 : indexAlur;

  async function batalkan() {
    if (!window.confirm("Yakin ingin membatalkan pengajuan ini?")) return;
    setBusy(true);
    setErrBatal("");
    try {
      await ubahStatusPeminjaman(p.id, "dibatalkan");
      setP({ ...p, status: "dibatalkan" });
    } catch (err) {
      setErrBatal(err.message || "Gagal membatalkan pengajuan.");
    } finally {
      setBusy(false);
    }
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
              {labelStatusPeminjaman(p)}
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
                <li key={i.barangId} className="flex justify-between">
                  <span>
                    {i.nama} × {i.qty}
                  </span>
                  <span className="text-slate-500">
                    {formatRupiah(i.subtotal)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Timeline */}
          {dihentikan ? (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Pengajuan ini {p.status === "dibatalkan" ? "sudah dibatalkan" : "ditolak"}
              {" "}dan tidak akan diproses lebih lanjut.
            </div>
          ) : (
            <div className="mt-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Progres pengajuan
              </p>
              <div className="relative pl-2">
                {ALUR.map((step, i) => {
                  const selesai = i < langkahAktif;
                  const aktif = i === langkahAktif;
                  const terlewati = i <= langkahAktif;
                  const terakhir = i === ALUR.length - 1;
                  return (
                    <div key={step.key} className="relative flex gap-4 pb-7 last:pb-0">
                      {!terakhir && (
                        <span
                          className={`absolute left-[9px] top-5 h-full w-0.5 ${
                            selesai ? "bg-blue-500" : "bg-slate-200"
                          }`}
                        />
                      )}
                      <span
                        className={`z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                          terlewati ? "bg-blue-600" : "bg-slate-300"
                        } ${aktif ? "ring-4 ring-blue-200 animate-pulse" : ""}`}
                      >
                        {selesai ? "✓" : aktif ? "●" : ""}
                      </span>
                      <div>
                        <p
                          className={`text-sm font-semibold ${
                            aktif
                              ? "text-blue-700"
                              : terlewati
                              ? "text-slate-900"
                              : "text-slate-400"
                          }`}
                        >
                          {step.label || statusLabel[step.key]}
                          {aktif && (
                            <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                              Sedang berjalan
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {p.status === "terlambat" && (
                <p className="mt-3 rounded-lg bg-orange-50 p-3 text-xs text-orange-700">
                  Peminjaman ini sudah melewati tanggal selesai. Segera kembalikan barang.
                </p>
              )}
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
              Kode Pesanan <b className="block text-slate-800">{p.kodePesanan || "-"}</b>
            </p>
            <p>
              Total <b className="block text-slate-800">{formatRupiah(p.totalBayar)}</b>
            </p>
          </div>

          {/* WhatsApp ke admin */}
          <a
            href={linkWA(WA_ADMIN, pesanKeAdmin(p, getCurrentUser()?.nama))}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700"
          >
            💬 Hubungi Admin via WhatsApp
          </a>

          {/* Aksi */}
          {p.status === "disetujui" && p.sudahBayar && (
            <p className="mt-3 rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
              Pembayaran kamu sudah diterima dan sedang menunggu verifikasi admin.
            </p>
          )}

          {p.status === "disetujui" && !p.sudahBayar && (
            <Link
              href={`/pembayaran/${p.id}`}
              className="mt-3 block w-full rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
            >
              Bayar Sekarang
            </Link>
          )}

          {(p.status === "menunggu_persetujuan" || (p.status === "disetujui" && !p.sudahBayar)) && (
            <button
              onClick={batalkan}
              disabled={busy}
              className="mt-3 w-full text-sm font-medium text-red-500 hover:text-red-600 disabled:opacity-50"
            >
              {busy ? "Memproses..." : "Batalkan pengajuan"}
            </button>
          )}
          {errBatal && (
            <p className="mt-2 rounded-lg bg-red-50 p-3 text-xs text-red-600">{errBatal}</p>
          )}
        </div>
      </div>
    </div>
  );
}