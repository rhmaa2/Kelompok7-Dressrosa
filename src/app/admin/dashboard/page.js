"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { getBarang, getPengajuan, getUsers } from "@/lib/store";
import { formatRupiah } from "@/lib/utils";

export default function Dashboard() {
  const [d, setD] = useState({ b: [], p: [], u: [] });

  useEffect(() => {
    setD({ b: getBarang(), p: getPengajuan(), u: getUsers() });
  }, []);

  const pend = d.p.filter((x) => x.status === "PENDING").length;
  const revenue = d.p
    .filter((x) => x.sudahBayar)
    .reduce((s, x) => s + x.totalSewa, 0);

  return (
    <div>
      <h1 className="text-3xl font-black">Dashboard Admin</h1>
      <p className="mt-1 text-sm text-slate-500">
        Ringkasan pengelolaan Eventra.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-xs text-slate-500">Total Barang</p>
          <b className="text-3xl">{d.b.length}</b>
        </Card>
        <Card>
          <p className="text-xs text-slate-500">Menunggu Approval</p>
          <b className="text-3xl text-amber-600">{pend}</b>
        </Card>
        <Card>
          <p className="text-xs text-slate-500">User</p>
          <b className="text-3xl">
            {d.u.filter((x) => x.role === "user").length}
          </b>
        </Card>
        <Card>
          <p className="text-xs text-slate-500">Pendapatan Sewa</p>
          <b className="text-xl text-emerald-600">
            {formatRupiah(revenue)}
          </b>
        </Card>
      </div>

      <div className="mt-6 rounded-xl border bg-white p-5">
        <h2 className="font-bold">Alur sistem</h2>
        <p className="mt-2 text-sm text-slate-500">
          PENDING → APPROVED → DIPROSES → SIAP → SEDANG DISEWA → COMPLETED
        </p>
      </div>
    </div>
  );
}