"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { getPeminjamanLengkap } from "@/lib/store";

<<<<<<< HEAD
function isTerlambat(p) {
  if (p.status !== "sedang_dipinjam") return false;
  const selesai = new Date(p.tanggalSelesai);
  const hariIni = new Date(new Date().toDateString());
  return selesai < hariIni;
}

export default function PetugasDashboard() {
  const [p, setP] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPeminjamanLengkap()
      .then(setP)
      .finally(() => setLoading(false));
  }, []);

  const siapDiambil = p.filter((x) => x.status === "siap_diambil").length;
  const sedangDipinjam = p.filter((x) => x.status === "sedang_dipinjam" && !isTerlambat(x)).length;
  const terlambat = p.filter((x) => isTerlambat(x)).length;
  const menungguCek = p.filter((x) => x.status === "dikembalikan").length;

  return (
    <div>
      <h1 className="text-3xl font-black">Dashboard Petugas</h1>
      {loading ? (
        <p className="mt-6 text-sm text-slate-400">Memuat...</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <p className="text-sm text-slate-500">Siap diambil/dikirim</p>
            <b className="text-3xl text-indigo-600">{siapDiambil}</b>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Sedang dipinjam</p>
            <b className="text-3xl text-purple-600">{sedangDipinjam}</b>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Terlambat</p>
            <b className="text-3xl text-orange-600">{terlambat}</b>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Menunggu pengecekan</p>
            <b className="text-3xl text-amber-600">{menungguCek}</b>
          </Card>
        </div>
      )}
=======
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
>>>>>>> 7de14aa1972d1451ca647b3ad292645f11e8dadb
    </div>
  );
}