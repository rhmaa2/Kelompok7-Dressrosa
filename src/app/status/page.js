"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUser, getPengajuan, seedStore } from "@/lib/store";
import { formatRupiah, formatTanggal, statusClass, statusLabel } from "@/lib/utils";

export default function StatusPage() {
  const [list, setList] = useState([]);

  useEffect(() => {
    seedStore();
    const u = getCurrentUser();
    setList(
      getPengajuan()
        .filter((p) => (u ? p.userId === u.id : true))
        .filter((p) => !["COMPLETED", "CANCELLED", "REJECTED"].includes(p.status))
    );
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
        {!list.length ? (
          <div className="rounded-xl border border-dashed p-10 text-center text-slate-400">
            Belum ada peminjaman aktif.
          </div>
        ) : (
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
                    {p.items.map((i) => `${i.nama} ×${i.qty}`).join(", ")}
                  </h2>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                    p.status
                  )}`}
                >
                  {statusLabel[p.status] || p.status}
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
          ))
        )}
      </div>
    </div>
  );
}