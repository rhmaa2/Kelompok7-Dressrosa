"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import StatusBadge from "@/components/statusBadge";

export default function StatusPage() {
  const [daftarPengajuan, setDaftarPengajuan] = useState([]);
  const [filterStatus, setFilterStatus] = useState("SEMUA");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("daftarPengajuan")) || [];
    setDaftarPengajuan(data);
  }, []);

  const pengajuanAktif = daftarPengajuan.filter(
    (item) => item.status === "PENDING" || item.status === "APPROVED"
  );

  const dataTampil =
    filterStatus === "SEMUA"
      ? pengajuanAktif
      : pengajuanAktif.filter((item) => item.status === filterStatus);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Status Peminjaman</h1>
      <p className="text-sm text-gray-500 mb-6">Pantau pengajuan peminjaman yang masih berjalan.</p>

      <div className="flex gap-2 mb-6">
        {["SEMUA", "PENDING", "APPROVED"].map((opsi) => (
          <button
            key={opsi}
            onClick={() => setFilterStatus(opsi)}
            className={`px-4 py-2 text-sm rounded-lg border transition ${
              filterStatus === opsi
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {opsi === "SEMUA" ? "Semua" : opsi}
          </button>
        ))}
      </div>

      {dataTampil.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
          <p className="text-gray-500 text-sm">Belum ada pengajuan peminjaman aktif.</p>
          <Link href="/pengajuan" className="inline-block mt-3 text-sm text-blue-600 hover:underline">
            Lihat Katalog Alat &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {dataTampil.map((item) => (
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
              <p className="text-sm font-semibold text-blue-600 mt-2">
                Rp {Number(item.totalHarga).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}