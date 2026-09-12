"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import StatusBadge from "@/components/statusBadge";

const STATUS_RIWAYAT = ["COMPLETED", "REJECTED", "CANCELLED"];

export default function RiwayatPage() {
  const [daftarPengajuan, setDaftarPengajuan] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("daftarPengajuan")) || [];
    setDaftarPengajuan(data);
  }, []);

  const riwayat = daftarPengajuan.filter((item) => STATUS_RIWAYAT.includes(item.status));

  return (
    
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/status" className="inline-block mb-6 text-sm text-blue-600 hover:underline">
        ← Kembali ke Status Aktif
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Riwayat Peminjaman</h1>
      <p className="text-sm text-gray-500 mb-6">Pengajuan yang sudah selesai, ditolak, atau dibatalkan.</p>

      {riwayat.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
          <p className="text-gray-500 text-sm">Belum ada riwayat peminjaman.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {riwayat.map((item) => (
            <Link
              key={item.id}
              href={`/status/${item.id}`}
              className="block bg-white p-5 rounded-lg shadow-md border border-gray-200 hover:border-blue-400 transition"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="font-semibold text-gray-800">{item.namaAcara}</h2>
                  <p className="text-xs text-gray-500">Atas nama {item.namaPeminjam}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
              <p className="text-xs text-gray-500">
                {item.tanggalMulai} &rarr; {item.tanggalSelesai}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}