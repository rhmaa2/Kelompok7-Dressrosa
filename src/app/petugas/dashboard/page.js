"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { getPengajuan } from "@/lib/store";

export default function PetugasDashboard() {
  const [p, setP] = useState([]);

  useEffect(() => {
    setP(getPengajuan());
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-black">Dashboard Petugas</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-slate-500">Perlu disiapkan</p>
          <b className="text-3xl text-cyan-600">
            {p.filter((x) => x.status === "DIPROSES").length}
          </b>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Siap dikirim/diambil</p>
          <b className="text-3xl text-indigo-600">
            {
              p.filter((x) =>
                ["SIAP_DIAMBIL", "SIAP_DIKIRIM"].includes(x.status)
              ).length
            }
          </b>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Sedang disewa</p>
          <b className="text-3xl text-purple-600">
            {p.filter((x) => x.status === "SEDANG_DI_SEWA").length}
          </b>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Menunggu pengecekan</p>
          <b className="text-3xl text-amber-600">
            {p.filter((x) => x.status === "DIKEMBALIKAN").length}
          </b>
        </Card>
      </div>
    </div>
  );
}
