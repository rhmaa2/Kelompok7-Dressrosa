"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getCurrentUser,
  getPeminjamanLengkap,
} from "@/lib/store";
import {
  formatRupiah,
  formatTanggal,
  statusClass,
  labelStatusPeminjaman,
} from "@/lib/utils";

const SELESAI = ["selesai", "dibatalkan", "ditolak"];

export default function StatusPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const u = getCurrentUser();

    getPeminjamanLengkap()
      .then((data) => {
        if (!mounted) return;

        const hasil = data
          .filter((p) =>
            u ? String(p.userId) === String(u.id) : true
          )
          .filter((p) => !SELESAI.includes(p.status));

        setList(hasil);
      })
      .catch((err) => {
        if (mounted) {
          setError(
            err.message || "Gagal memuat data peminjaman."
          );
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const totalPengajuan = list.length;

  const totalBarang = list.reduce(
    (total, p) =>
      total +
      (p.items?.reduce(
        (jumlah, item) => jumlah + Number(item.qty || 0),
        0
      ) || 0),
    0
  );

  const menunggu = list.filter(
    (p) =>
      p.status === "menunggu_persetujuan" ||
      p.status === "menunggu_verifikasi"
  ).length;

  const sedangBerjalan = list.filter(
    (p) =>
      p.status === "disetujui" ||
      p.status === "siap_diambil" ||
      p.status === "sedang_dipinjam" ||
      p.status === "dikembalikan" ||
      p.status === "diperiksa" ||
      p.status === "terlambat"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/barang"
              className="text-sm font-medium text-slate-500 transition hover:text-blue-600"
            >
              ← Kembali ke Beranda
            </Link>

            <h1 className="mt-4 text-3xl font-black text-slate-900">
              Status Peminjaman
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Pantau perkembangan pengajuan peminjaman
              perlengkapan acara kamu.
            </p>
          </div>

          <Link
            href="/riwayat"
            className="w-fit rounded-lg border bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-600"
          >
            Lihat Riwayat →
          </Link>
        </div>

        {/* Summary */}
        {!loading && !error && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  Pengajuan Aktif
                </p>

                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                  📋
                </span>
              </div>

              <p className="mt-3 text-3xl font-black text-slate-900">
                {totalPengajuan}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                pengajuan masih berjalan
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  Total Barang
                </p>

                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100">
                  📦
                </span>
              </div>

              <p className="mt-3 text-3xl font-black text-green-600">
                {totalBarang}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                unit sedang dalam pengajuan
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  Perlu Ditunggu
                </p>

                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100">
                  ⏳
                </span>
              </div>

              <p className="mt-3 text-3xl font-black text-amber-600">
                {menunggu}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                menunggu proses selanjutnya
              </p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="mt-7">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Pengajuan Berjalan
              </h2>

              <p className="text-xs text-slate-400">
                {sedangBerjalan > 0
                  ? `${sedangBerjalan} pengajuan sedang diproses`
                  : "Belum ada pengajuan yang sedang diproses"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Loading */}
            {loading && (
              <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

                <p className="text-sm text-slate-400">
                  Memuat status peminjaman...
                </p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                <div className="flex gap-3">
                  <span className="text-xl">⚠️</span>

                  <div>
                    <p className="font-semibold text-red-700">
                      Gagal memuat data
                    </p>

                    <p className="mt-1 text-sm text-red-600">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && !list.length && (
              <div className="rounded-2xl border border-dashed bg-white p-12 text-center shadow-sm">
                <div className="text-5xl">📦</div>

                <h2 className="mt-4 text-lg font-bold text-slate-800">
                  Belum Ada Peminjaman
                </h2>

                <p className="mx-auto mt-1 max-w-md text-sm text-slate-400">
                  Kamu belum memiliki pengajuan peminjaman
                  yang sedang berjalan.
                </p>

                <Link
                  href="/barang"
                  className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Cari Perlengkapan
                </Link>
              </div>
            )}

            {/* List */}
            {!loading &&
              !error &&
              list.map((p) => {
                const jumlahBarang =
                  p.items?.reduce(
                    (total, item) =>
                      total + Number(item.qty || 0),
                    0
                  ) || 0;

                const sudahBayar = Boolean(p.sudahBayar);

                return (
                  <Link
                    href={`/status/${p.id}`}
                    key={p.id}
                    className="group block overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                  >
                    {/* Card Header */}
                    <div className="border-b bg-slate-50 px-5 py-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-medium text-slate-400">
                            Pengajuan #{p.id}
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-700">
                            {p.kodePesanan
                              ? `Kode: ${p.kodePesanan}`
                              : "Kode pesanan belum tersedia"}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusClass(
                            p.status
                          )}`}
                        >
                          {labelStatusPeminjaman(p)}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Barang Disewa
                          </p>

                          <div className="mt-2 space-y-1">
                            {p.items?.length ? (
                              p.items.slice(0, 3).map((item) => (
                                <p
                                  key={item.barangId}
                                  className="truncate text-sm font-medium text-slate-700"
                                >
                                  📦 {item.nama}{" "}
                                  <span className="text-slate-400">
                                    ×{item.qty}
                                  </span>
                                </p>
                              ))
                            ) : (
                              <p className="text-sm text-slate-400">
                                Tidak ada barang
                              </p>
                            )}

                            {p.items?.length > 3 && (
                              <p className="text-xs font-medium text-blue-600">
                                + {p.items.length - 3} barang lainnya
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0 rounded-xl bg-slate-50 px-4 py-3 sm:min-w-[150px]">
                          <p className="text-xs text-slate-400">
                            Total Pembayaran
                          </p>

                          <p className="mt-1 font-black text-slate-800">
                            {formatRupiah(p.totalBayar)}
                          </p>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="mt-5 grid gap-3 border-t pt-4 sm:grid-cols-3">
                        <div>
                          <p className="text-xs text-slate-400">
                            Periode
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-700">
                            {formatTanggal(p.tanggalMulai)}
                            {" – "}
                            {formatTanggal(p.tanggalSelesai)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">
                            Jumlah Barang
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-700">
                            {jumlahBarang} unit
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">
                            Pembayaran
                          </p>

                          <p
                            className={`mt-1 text-sm font-semibold ${
                              sudahBayar
                                ? "text-green-600"
                                : "text-orange-500"
                            }`}
                          >
                            {sudahBayar
                              ? "✓ Sudah dibayar"
                              : "Belum dibayar"}
                          </p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-4 flex items-center justify-between border-t pt-4">
                        <p className="text-xs text-slate-400">
                          Klik untuk melihat detail progres
                        </p>

                        <span className="text-sm font-bold text-blue-600 transition group-hover:translate-x-1">
                          Lihat Detail →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}