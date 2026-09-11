"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";

export default function PetugasDashboardPage() {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetch("/api/pengajuan").then((res) => res.json()).then((data) => setList(Array.isArray(data) ? data : []));
  }, []);

  const siapKirim = list.filter((p) => p.status === "DIPROSES").length;
  const sedangDisewa = list.filter((p) => p.status === "SEDANG_DISEWA").length;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Dashboard Petugas</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-xs text-slate-500">Perlu Disiapkan (Kirim/Ambil)</p>
          <p className="text-2xl font-bold text-cyan-600">{siapKirim}</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-500">Sedang Disewa (Menunggu Kembali)</p>
          <p className="text-2xl font-bold text-purple-600">{sedangDisewa}</p>
        </Card>
      </div>
    </div>
  );
}
