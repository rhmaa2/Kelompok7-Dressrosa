"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import { getBarang, getPeminjamanLengkap, getUsers } from "@/lib/store";
import { formatRupiah } from "@/lib/utils";

const STATS = [
  { key: "barang", label: "Total Barang", icon: "📦", color: "from-indigo-500 to-violet-500", href: "/admin/barang" },
  { key: "pending", label: "Menunggu Persetujuan", icon: "⏳", color: "from-amber-500 to-orange-500", href: "/admin/pengajuan" },
  { key: "user", label: "User", icon: "👥", color: "from-emerald-500 to-teal-500", href: "/admin/user" },
  { key: "revenue", label: "Pendapatan Sewa", icon: "💰", color: "from-fuchsia-500 to-pink-500", href: "/admin/pembayaran" },
];

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

  const values = {
    barang: d.b.length,
    pending: pend,
    user: d.u.filter((x) => x.role === "user").length,
    revenue: formatRupiah(revenue),
  };

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight">
        <span className="gradient-text">Dashboard</span> Admin
      </h1>
      <p className="mt-1 text-sm text-slate-500">Ringkasan pengelolaan Eventra.</p>

      {loading ? (
        <p className="mt-6 text-sm text-slate-400">Memuat data dari API...</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <Link key={s.key} href={s.href} className="block">
              <Card className="card-hover cursor-pointer transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-500">{s.label}</p>
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-base shadow-md`}
                  >
                    {s.icon}
                  </span>
                </div>
                <b className="mt-2 block text-2xl font-black text-slate-800">
                  {values[s.key]}
                </b>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm">
        <h2 className="font-bold text-slate-800">Alur sistem</h2>
        <p className="mt-2 text-sm text-slate-500">
          Menunggu Persetujuan → Disetujui → Siap Diambil → Sedang Dipinjam → Dikembalikan → Diperiksa → Selesai
        </p>
      </div>
    </div>
  );
}