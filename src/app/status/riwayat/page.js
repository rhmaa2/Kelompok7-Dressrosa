"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getCurrentUser,
  getPeminjamanLengkap,
} from "@/lib/store";
import {
  formatTanggal,
  statusClass,
  statusLabel,
} from "@/lib/utils";

const RIWAYAT = ["selesai", "dibatalkan", "ditolak"];

export default function RiwayatPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const user = getCurrentUser();

    getPeminjamanLengkap()
      .then((data) => {
        if (!mounted) return;

        const hasil = data
          .filter((p) =>
            user
              ? String(p.userId) === String(user.id)
              : true
          )
          .filter((p) => RIWAYAT.includes(p.status));

        setList(hasil);
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  function totalBarang(items) {
    return items.reduce(
      (total, item) => total + item.qty,
      0
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* HEADER */}
        <div className="mb-6">
          <Link
            href="/barang"
            className="inline-flex items-center text-sm font-medium text-slate-500 transition hover:text-blue-600"
          >
            ← Kembali ke Status
          </Link>

          <div className="mt-4">
            <h1 className="text-3xl font-black text-slate-900">
              Riwayat Peminjaman
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Daftar pengajuan peminjaman yang telah selesai,
              dibatalkan, atau ditolak.
            </p>
          </div>
        </div>

        {/* RINGKASAN */}
        {!loading && (
          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500">
                Total Riwayat
              </p>

              <p className="mt-1 text-2xl font-black text-slate-900">
                {list.length}
              </p>

              <p className="text-xs text-slate-400">
                pengajuan peminjaman
              </p>
            </div>

            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500">
                Total Barang
              </p>

              <p className="mt-1 text-2xl font-black text-blue-600">
                {list.reduce(
                  (total, p) =>
                    total + totalBarang(p.items),
                  0
                )}
              </p>

              <p className="text-xs text-slate-400">
                barang dalam seluruh riwayat
              </p>
            </div>
          </div>
        )}

        {/* TABLE */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="border-b bg-slate-50 px-5 py-4">
            <h2 className="font-bold text-slate-800">
              Daftar Riwayat
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4 font-semibold text-slate-600">
                    Pengajuan
                  </th>

                  <th className="p-4 font-semibold text-slate-600">
                    Barang
                  </th>

                  <th className="p-4 font-semibold text-slate-600">
                    Periode
                  </th>

                  <th className="p-4 font-semibold text-slate-600">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {list.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t transition hover:bg-slate-50"
                  >
                    {/* PENGAJUAN */}
                    <td className="p-4">
                      <Link
                        href={`/status/${p.id}`}
                        className="font-bold text-blue-600 hover:text-blue-800"
                      >
                        #{p.id}
                      </Link>

                      <p className="mt-1 text-xs text-slate-400">
                        Lihat detail →
                      </p>
                    </td>

                    {/* BARANG */}
                    <td className="p-4">
                      <p className="max-w-xs font-medium text-slate-700">
                        {p.items
                          .map(
                            (item) =>
                              `${item.nama} ×${item.qty}`
                          )
                          .join(", ")}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {totalBarang(p.items)} barang
                      </p>
                    </td>

                    {/* PERIODE */}
                    <td className="p-4 text-slate-600">
                      <p>
                        {formatTanggal(
                          p.tanggalMulai
                        )}
                      </p>

                      <p className="my-1 text-xs text-slate-400">
                        sampai
                      </p>

                      <p>
                        {formatTanggal(
                          p.tanggalSelesai
                        )}
                      </p>
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                          p.status
                        )}`}
                      >
                        {statusLabel[p.status] ||
                          p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="p-10 text-center">
              <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"></div>

              <p className="text-sm text-slate-400">
                Memuat riwayat peminjaman...
              </p>
            </div>
          )}

          {/* EMPTY */}
          {!loading && !list.length && (
            <div className="p-10 text-center">
              <div className="mb-3 text-3xl">
                📋
              </div>

              <p className="font-semibold text-slate-700">
                Belum Ada Riwayat
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Pengajuan yang sudah selesai, dibatalkan,
                atau ditolak akan muncul di sini.
              </p>

              <Link
                href="/barang"
                className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Lihat Barang
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}