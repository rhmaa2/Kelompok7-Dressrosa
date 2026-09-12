"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import StatusBadge from "@/components/statusBadge";
import StatusTimeline from "@/components/statusTimeline";

export default function DetailStatusPage() {
  const params = useParams();
  const [pengajuan, setPengajuan] = useState(null);
  const [sudahDicek, setSudahDicek] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("daftarPengajuan")) || [];
    const ditemukan = data.find((item) => item.id === params.id);
    setPengajuan(ditemukan || null);
    setSudahDicek(true);
  }, [params.id]);

  if (!sudahDicek) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <p className="text-sm text-gray-500">Memuat data pengajuan...</p>
      </div>
    );
  }

  if (!pengajuan) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <p className="text-sm text-gray-500">Pengajuan tidak ditemukan.</p>
        <Link href="/status" className="text-sm text-blue-600 hover:underline">
          ← Kembali ke Status Peminjaman
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href="/status" className="inline-block mb-6 text-sm text-blue-600 hover:underline">
        ← Kembali ke Status Peminjaman
      </Link>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{pengajuan.namaAcara}</h1>
            <p className="text-sm text-gray-500">Atas nama {pengajuan.namaPeminjam}</p>
          </div>
          <StatusBadge status={pengajuan.status} />
        </div>

        <div className="my-6">
          <StatusTimeline status={pengajuan.status} />
        </div>

        <div className="border-t pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Tanggal Mulai</span>
            <span className="text-gray-800">{pengajuan.tanggalMulai}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tanggal Selesai</span>
            <span className="text-gray-800">{pengajuan.tanggalSelesai}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Total Harga</span>
            <span className="text-blue-600 font-semibold">
              Rp {Number(pengajuan.totalHarga).toLocaleString()}
            </span>
          </div>
          {pengajuan.catatan && (
            <div className="flex justify-between">
              <span className="text-gray-500">Catatan</span>
              <span className="text-gray-800">{pengajuan.catatan}</span>
            </div>
          )}
        </div>

        {pengajuan.items && pengajuan.items.length > 0 && (
          <div className="border-t mt-4 pt-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Alat yang Disewa</h2>
            <div className="space-y-2">
              {pengajuan.items.map((alat) => (
                <div key={alat.id} className="flex justify-between text-sm text-gray-600">
                  <span>{alat.nama_barang}</span>
                  <span>{alat.quantity} unit</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}