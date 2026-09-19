"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { getBarang, getPeminjamanLengkap, getUsers } from "@/lib/store";
import { formatRupiah } from "@/lib/utils";

export default function Dashboard() {
  const [d, setD] = useState({ b: [], p: [], u: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([getBarang(), getPeminjamanLengkap(), getUsers()])
      .then(([b, p, u]) => {
        if (mounted) setD({ b, p, u });
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const pend = d.p.filter((x) => x.status === "menunggu_persetujuan").length;
  const revenue = d.p
    .filter((x) => ["selesai", "diperiksa", "dikembalikan", "sedang_dipinjam", "siap_diambil"].includes(x.status))
    .reduce((s, x) => s + x.totalBayar, 0);

  return (
    <div>
      <h1 className="text-3xl font-black">Dashboard Admin</h1>
      <p className="mt-1 text-sm text-slate-500">
        Ringkasan pengelolaan Eventra.
      </p>

      {loading ? (
        <p className="mt-6 text-sm text-slate-400">Memuat data dari API...</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <p className="text-xs text-slate-500">Total Barang</p>
            <b className="text-3xl">{d.b.length}</b>
          </Card>
          <Card>
            <p className="text-xs text-slate-500">Menunggu Persetujuan</p>
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
            <b className="text-xl text-blue-600">
              {formatRupiah(revenue)}
            </b>
          </Card>
        </div>
      )}

      <div className="mt-6 rounded-xl border bg-white p-5">
        <h2 className="font-bold">Alur sistem</h2>
        <p className="mt-2 text-sm text-slate-500">
          Menunggu Persetujuan → Disetujui → Siap Diambil → Sedang Dipinjam → Dikembalikan → Diperiksa → Selesai
        </p>
      </div>
    </div>
  );
}