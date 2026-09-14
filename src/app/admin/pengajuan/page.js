"use client";


import { useEffect, useState } from "react";
import { getPengajuan, savePengajuan } from "@/lib/store";
import TabelPengajuan from "@/components/admin/TabelPengajuan";

export default function AdminPengajuan() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getPengajuan());
  }, []);

  function status(id, status) {
    const next = items.map((p) =>
      p.id === id
        ? {
            ...p,
            status,
            sudahBayar: status === "DIPROSES" ? true : p.sudahBayar,
          }
        : p
    );
    savePengajuan(next);
    setItems(next);
  }

  return (
    <div>
      <h1 className="text-3xl font-black">Verifikasi Pengajuan</h1>
      <p className="mt-1 mb-6 text-sm text-slate-500">
        Approve/reject pengajuan dan lanjutkan setelah pembayaran.
      </p>
      <TabelPengajuan items={items} onStatus={status} />
    </div>
  );
}