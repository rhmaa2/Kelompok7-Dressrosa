"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { getPengajuan } from "@/lib/store";

export default function PetugasDashboard() {
  const [pengajuanList, setPengajuanList] = useState([]);

  useEffect(() => {
    const data = getPengajuan();
    setPengajuanList(data || []);
  }, []);

  // Menghitung jumlah masing-masing status agar JSX lebih bersih
  const countPerluDisiapkan = pengajuanList.filter((item) => item.status === "DIPROSES").length;
  const countSiap = pengajuanList.filter((item) => ["SIAP_DIAMBIL", "SIAP_DIKIRIM"].includes(item.status)).length;
  const countSedangDisewa = pengajuanList.filter((item) => item.status === "SEDANG_DI_SEWA").length;
  const countMenungguPengecekan = pengajuanList.filter((item) => item.status === "DIKEMBALIKAN").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-800">Dashboard Petugas</h1>
        <p className="mt-1 text-sm text-slate-500">
          Ringkasan status pengajuan dan aktivitas perlengkapan saat ini.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-sm font-medium text-slate-500">Perlu disiapkan</p>
          <b className="mt-2 block text-4xl text-cyan-600">{countPerluDisiapkan}</b>
        </Card>
        
        <Card>
          <p className="text-sm font-medium text-slate-500">Siap dikirim/diambil</p>
          <b className="mt-2 block text-4xl text-indigo-600">{countSiap}</b>
        </Card>
        
        <Card>
          <p className="text-sm font-medium text-slate-500">Sedang disewa</p>
          <b className="mt-2 block text-4xl text-purple-600">{countSedangDisewa}</b>
        </Card>
        
        <Card>
          <p className="text-sm font-medium text-slate-500">Menunggu pengecekan</p>
          <b className="mt-2 block text-4xl text-amber-600">{countMenungguPengecekan}</b>
        </Card>
      </div>
    </div>
  );
}