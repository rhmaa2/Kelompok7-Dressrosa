"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUser, getPengajuan } from "@/lib/store";
import { formatTanggal, statusClass, statusLabel } from "@/lib/utils";

export default function RiwayatPage() {
  const [riwayatList, setRiwayatList] = useState([]);
  
  useEffect(() => {
    const currentUser = getCurrentUser();
    const allPengajuan = getPengajuan();

    // Filter data pengajuan sesuai user dan status akhir (selesai/batal/ditolak)
    const filteredRiwayat = allPengajuan.filter((item) => {
      const isUserMatch = currentUser ? item.userId === currentUser.id : true;
      const isStatusRiwayat = ["COMPLETED", "CANCELLED", "REJECTED"].includes(item.status);
      
      return isUserMatch && isStatusRiwayat;
    });

    setRiwayatList(filteredRiwayat);
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <div>
        <Link href="/barang" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-800">
          &larr; Kembali ke Status
        </Link>
        <h1 className="mt-2 text-3xl font-black text-slate-800">Riwayat Peminjaman</h1>
        <p className="mt-1 text-sm text-slate-500">
          Daftar pengajuan yang sudah selesai, dibatalkan, atau ditolak.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="p-4 font-semibold">Pengajuan</th>
              <th className="p-4 font-semibold">Periode</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {riwayatList.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-10 text-center text-slate-400">
                  Belum ada riwayat peminjaman.
                </td>
              </tr>
            ) : (
              riwayatList.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-slate-50/50">
                  <td className="p-4">
                    <Link
                      href={`/status/${item.id}`}
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      #{item.id}
                    </Link>
                    <div className="mt-1 text-xs text-slate-500">
                      {item.items.map((i) => i.nama).join(", ")}
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">
                    {formatTanggal(item.tanggalMulai)} &ndash; {formatTanggal(item.tanggalSelesai)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass(item.status)}`}
                    >
                      {statusLabel[item.status] || item.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}