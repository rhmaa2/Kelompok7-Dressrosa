"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  getPeminjamanLengkap,
  ubahStatusPeminjaman,
  getCurrentUser,
} from "@/lib/store";
import { WA_ADMIN, linkWA, pesanKeAdmin } from "@/lib/whatsapp";
import {
  formatRupiah,
  formatTanggal,
  statusLabel,
  labelStatusPeminjaman,
} from "@/lib/utils";

const ALUR = [
  { key: "menunggu_persetujuan" },
  { key: "disetujui" },
  {
    key: "menunggu_verifikasi",
    label: "Menunggu Verifikasi Pembayaran",
  },
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

        const found = data.find(
          (item) => String(item.id) === String(id)
        );

        setP(found || false);
      })
      .catch(() => {
        if (mounted) setP(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  if (p === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
          <p className="text-sm text-slate-400">
            Memuat detail pengajuan...
          </p>
        </div>
      </div>
    );
  }

  if (p === false) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
          <div className="text-4xl">📋</div>

          <h1 className="mt-3 text-lg font-bold text-slate-800">
            Pengajuan tidak ditemukan
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Data peminjaman yang kamu cari tidak tersedia.
          </p>

          <Link
            href="/status"
            className="mt-5 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Kembali ke Status
          </Link>
        </div>
      </div>
    );
  }

  const dihentikan = STATUS_BERHENTI.includes(p.status);

  const kunciAktif =
    p.status === "terlambat"
      ? "sedang_dipinjam"
      : p.status === "disetujui" && p.sudahBayar
      ? "menunggu_verifikasi"
      : p.status;

  const indexAlur = ALUR.findIndex(
    (step) => step.key === kunciAktif
  );

  const langkahAktif = indexAlur < 0 ? 0 : indexAlur;

  const totalJenisBarang = p.items?.length || 0;

  const totalJumlahBarang =
    p.items?.reduce(
      (total, item) => total + Number(item.qty || 0),
      0
    ) || 0;

  async function batalkan() {
    if (!window.confirm("Yakin ingin membatalkan pengajuan ini?")) {
      return;
    }

    setBusy(true);
    setErrBatal("");

    try {
      await ubahStatusPeminjaman(p.id, "dibatalkan");

      setP({
        ...p,
        status: "dibatalkan",
      });
    } catch (err) {
      setErrBatal(
        err.message || "Gagal membatalkan pengajuan."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Back */}
        <Link
          href="/status"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          ← Kembali ke Status
        </Link>

        {/* Main Card */}
        <div className="mt-5 overflow-hidden rounded-2xl border bg-white shadow-sm">
          {/* Header */}
          <div className="border-b bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Detail Pengajuan
                </p>

                <h1 className="mt-1 text-2xl font-black text-slate-900">
                  Peminjaman #{p.id}
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Kode pesanan: {p.kodePesanan || "-"}
                </p>
              </div>

              <span
                className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-bold ${
                  dihentikan
                    ? "bg-red-100 text-red-700"
                    : p.status === "selesai"
                    ? "bg-green-100 text-green-700"
                    : p.status === "terlambat"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {labelStatusPeminjaman(p)}
              </span>
            </div>
          </div>

          <div className="px-6 py-6">
            {/* Ringkasan Barang */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-400">
                  Jenis Barang
                </p>

                <p className="mt-1 text-2xl font-black text-slate-800">
                  {totalJenisBarang}
                </p>

                <p className="text-xs text-slate-400">
                  jenis perlengkapan
                </p>
              </div>

              <div className="rounded-xl border bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-400">
                  Jumlah Barang
                </p>

                <p className="mt-1 text-2xl font-black text-blue-600">
                  {totalJumlahBarang}
                </p>

                <p className="text-xs text-slate-400">
                  unit barang disewa
                </p>
              </div>
            </div>

            {/* Daftar Barang */}
            <div className="mt-7">
              <div className="mb-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Barang yang Disewa
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Daftar perlengkapan dalam pengajuan ini.
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border">
                <div className="divide-y">
                  {p.items.map((item) => (
                    <div
                      key={item.barangId}
                      className="flex items-center justify-between gap-4 p-4 transition hover:bg-slate-50"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800">
                          {item.nama}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Jumlah: {item.qty} unit
                        </p>
                      </div>

                      <p className="shrink-0 font-semibold text-slate-700">
                        {formatRupiah(item.subtotal)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Timeline */}
            {dihentikan ? (
              <div className="mt-7 rounded-xl border border-red-200 bg-red-50 p-5">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
                    ❌
                  </div>

                  <div>
                    <p className="font-bold text-red-700">
                      Pengajuan Berhenti
                    </p>

                    <p className="mt-1 text-sm leading-6 text-red-600">
                      Pengajuan ini{" "}
                      {p.status === "dibatalkan"
                        ? "sudah dibatalkan"
                        : "ditolak"}{" "}
                      dan tidak akan diproses lebih lanjut.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-8">
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Progres Pengajuan
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Pantau tahapan peminjaman barang kamu di sini.
                  </p>
                </div>

                <div className="relative">
                  {ALUR.map((step, i) => {
                    const selesai = i < langkahAktif;
                    const aktif = i === langkahAktif;
                    const terlewati = i <= langkahAktif;
                    const terakhir = i === ALUR.length - 1;

                    return (
                      <div
                        key={step.key}
                        className="relative flex gap-4 pb-7 last:pb-0"
                      >
                        {!terakhir && (
                          <span
                            className={`absolute left-[11px] top-6 h-full w-0.5 ${
                              selesai
                                ? "bg-blue-500"
                                : "bg-slate-200"
                            }`}
                          />
                        )}

                        <span
                          className={`z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                            terlewati
                              ? "bg-blue-600"
                              : "bg-slate-300"
                          } ${
                            aktif
                              ? "ring-4 ring-blue-100"
                              : ""
                          }`}
                        >
                          {selesai ? "✓" : aktif ? "●" : ""}
                        </span>

                        <div className="pt-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <p
                              className={`text-sm font-semibold ${
                                aktif
                                  ? "text-blue-700"
                                  : terlewati
                                  ? "text-slate-800"
                                  : "text-slate-400"
                              }`}
                            >
                              {step.label || statusLabel[step.key]}
                            </p>

                            {aktif && (
                              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                                Sedang berjalan
                              </span>
                            )}
                          </div>

                          {aktif && (
                            <p className="mt-1 text-xs text-slate-400">
                              Tahap pengajuan saat ini.
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {p.status === "terlambat" && (
                  <div className="mt-2 rounded-xl border border-orange-200 bg-orange-50 p-4">
                    <p className="text-sm font-semibold text-orange-700">
                      ⚠️ Peminjaman Terlambat
                    </p>

                    <p className="mt-1 text-xs leading-5 text-orange-600">
                      Peminjaman ini sudah melewati tanggal
                      selesai. Segera kembalikan barang untuk
                      menghindari masalah lebih lanjut.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Detail Peminjaman */}
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Informasi Peminjaman
              </p>

              <div className="mt-3 grid gap-3 rounded-xl border bg-slate-50 p-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-400">
                    Tanggal Mulai
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {formatTanggal(p.tanggalMulai)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Tanggal Selesai
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {formatTanggal(p.tanggalSelesai)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Kode Pesanan
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {p.kodePesanan || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Status Pembayaran
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {p.sudahBayar ? "Sudah Dibayar" : "Belum Dibayar"}
                  </p>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="mt-4 flex items-center justify-between rounded-xl bg-blue-50 px-5 py-4">
              <div>
                <p className="text-xs font-medium text-blue-600">
                  Total Pembayaran
                </p>

                <p className="mt-1 text-xs text-blue-400">
                  Untuk seluruh barang yang disewa
                </p>
              </div>

              <p className="text-xl font-black text-blue-700">
                {formatRupiah(p.totalBayar)}
              </p>
            </div>

            {/* WhatsApp */}
            <a
              href={linkWA(
                WA_ADMIN,
                pesanKeAdmin(p, getCurrentUser()?.nama)
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-green-700"
            >
              💬 Hubungi Admin via WhatsApp
            </a>

            {/* Payment */}
            {p.status === "disetujui" && p.sudahBayar && (
              <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-700">
                  ✓ Pembayaran sudah dikirim
                </p>

                <p className="mt-1 text-xs leading-5 text-blue-600">
                  Pembayaran kamu sudah diterima dan sedang
                  menunggu verifikasi admin.
                </p>
              </div>
            )}

            {p.status === "disetujui" && !p.sudahBayar && (
              <Link
                href={`/pembayaran/${p.id}`}
                className="mt-3 block w-full rounded-xl bg-blue-600 px-4 py-3.5 text-center text-sm font-bold text-white transition hover:bg-blue-700"
              >
                💳 Bayar Sekarang
              </Link>
            )}

            {/* Cancel */}
            {(p.status === "menunggu_persetujuan" ||
              (p.status === "disetujui" && !p.sudahBayar)) && (
              <button
                type="button"
                onClick={batalkan}
                disabled={busy}
                className="mt-4 w-full rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy
                  ? "Memproses pembatalan..."
                  : "Batalkan Pengajuan"}
              </button>
            )}

            {errBatal && (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-600">
                  {errBatal}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}