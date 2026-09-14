"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUser, getPengajuan } from "@/lib/store";
import { formatTanggal, statusClass, statusLabel } from "@/lib/utils";

export default function RiwayatPage() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const u = getCurrentUser();
    setList(
      getPengajuan()
        .filter((p) => (u ? p.userId === u.id : true))
        .filter((p) => ["COMPLETED", "CANCELLED", "REJECTED"].includes(p.status))
    );
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link href="/barang" className="text-sm text-slate-500 hover:text-slate-700">
        ← Status
      </Link>

      <h1 className="mt-4 text-3xl font-black">Riwayat Peminjaman</h1>

      <div className="mt-6 overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4">Pengajuan</th>
              <th className="p-4">Periode</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-4">
                  <Link
                    href={`/status/${p.id}`}
                    className="font-semibold text-blue-600"
                  >
                    #{p.id}
                  </Link>
                  <br />
                  <span className="text-xs text-slate-500">
                    {p.items.map((i) => i.nama).join(", ")}
                  </span>
                </td>
                <td className="p-4">
                  {formatTanggal(p.tanggalMulai)} –{" "}
                  {formatTanggal(p.tanggalSelesai)}
                </td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${statusClass(
                      p.status
                    )}`}
                  >
                    {statusLabel[p.status] || p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!list.length && (
          <p className="p-10 text-center text-slate-400">
            Belum ada riwayat.
          </p>
        )}
      </div>
    </div>
  );
}