"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { getPeminjamanLengkap } from "@/lib/store";

export default function PetugasDashboard() {
  const [p, setP] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPeminjamanLengkap()
      .then(setP)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-black">Dashboard Petugas</h1>
      {loading ? (
        <p className="mt-6 text-sm text-slate-400">Memuat...</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <p className="text-sm text-slate-500">Siap diambil/dikirim</p>
            <b className="text-3xl text-indigo-600">
              {p.filter((x) => x.status === "siap_diambil").length}
            </b>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Sedang dipinjam</p>
            <b className="text-3xl text-purple-600">
              {p.filter((x) => x.status === "sedang_dipinjam").length}
            </b>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Terlambat</p>
            <b className="text-3xl text-orange-600">
              {p.filter((x) => x.status === "terlambat").length}
            </b>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Menunggu pengecekan</p>
            <b className="text-3xl text-amber-600">
              {p.filter((x) => x.status === "dikembalikan").length}
            </b>
          </Card>
        </div>
      )}
    </div>
  );
}