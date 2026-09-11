"use client";

import { useEffect, useState } from "react";
import { formatRupiah } from "@/lib/utils";
import Card from "@/components/ui/Card";

export default function AdminDashboardPage() {
  const [list, setList] = useState([]);
  const [jumlahBarang, setJumlahBarang] = useState(0);

  useEffect(() => {
    fetch("/api/pengajuan").then((res) => res.json()).then((data) => setList(Array.isArray(data) ? data : []));
    fetch("/api/barang").then((res) => res.json()).then((data) => setJumlahBarang(Array.isArray(data) ? data.length : 0));
  }, []);

  const totalPengajuan = list.length;
  const menungguApproval = list.filter((p) => p.status === "PENDING").length;
  const pendapatan = list
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.totalSewa, 0);

  const jumlahPerBarang = {};
  list.forEach((p) => {
    p.items.forEach((item) => {
      jumlahPerBarang[item.nama] = (jumlahPerBarang[item.nama] || 0) + item.qty;
    });
  });
  const terlaris = Object.entries(jumlahPerBarang).sort((a, b) => b[1] - a[1])[0];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Dashboard Admin</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-xs text-slate-500">Total Pengajuan</p>
          <p className="text-2xl font-bold text-slate-800">{totalPengajuan}</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-500">Menunggu Approval</p>
          <p className="text-2xl font-bold text-amber-600">{menungguApproval}</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-500">Pendapatan (selesai)</p>
          <p className="text-2xl font-bold text-emerald-600">{formatRupiah(pendapatan)}</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-500">Barang Terlaris</p>
          <p className="text-lg font-bold text-slate-800">{terlaris ? terlaris[0] : "-"}</p>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Total Item Barang di Katalog</h2>
        <p className="text-sm text-slate-500">{jumlahBarang} jenis barang terdaftar</p>
      </div>
    </div>
  );
}
