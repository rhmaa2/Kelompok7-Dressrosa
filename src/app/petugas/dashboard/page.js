"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { getPeminjamanLengkap } from "@/lib/store";

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
    </div>
  );
}