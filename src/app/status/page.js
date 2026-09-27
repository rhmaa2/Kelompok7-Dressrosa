"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUser, getPeminjamanLengkap } from "@/lib/store";
import { formatRupiah, formatTanggal, statusClass, labelStatusPeminjaman } from "@/lib/utils";

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
        setList(
          data
            .filter((p) => (u ? String(p.userId) === String(u.id) : true))
            .filter((p) => !SELESAI.includes(p.status))
        );
      })
      .catch((err) => mounted && setError(err.message || "Gagal memuat data."))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link href="/barang" className="text-sm text-slate-500 hover:text-slate-700">
        ← Beranda
      </Link>

      <h1 className="mt-4 text-3xl font-black">Status Peminjaman</h1>
      <p className="mt-1 text-sm text-slate-500">
        Pantau pengajuan yang masih berjalan.
      </p>

      <div className="mt-6 space-y-4">
        {loading && (
          <div className="rounded-xl border border-dashed p-10 text-center text-slate-400">
            Memuat...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && !list.length && (
          <div className="rounded-xl border border-dashed p-10 text-center text-slate-400">
            Belum ada peminjaman aktif.
          </div>
        )}

        {!loading &&
          !error &&
          list.map((p) => (
            <Link
              href={`/status/${p.id}`}
              key={p.id}
              className="block rounded-2xl border bg-white p-5 shadow-sm hover:border-blue-300"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-400">
                    Pengajuan #{p.id}
                  </p>
                  <h2 className="font-bold">
                    {p.items.length
                      ? p.items.map((i) => `${i.nama} ×${i.qty}`).join(", ")
                      : "-"}
                  </h2>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                    p.status
                  )}`}
                >
                  {labelStatusPeminjaman(p)}
                </span>
              </div>
              <div className="mt-3 flex justify-between text-sm text-slate-500">
                <span>
                  {formatTanggal(p.tanggalMulai)} –{" "}
                  {formatTanggal(p.tanggalSelesai)}
                </span>
                <b className="text-slate-700">{formatRupiah(p.totalBayar)}</b>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}