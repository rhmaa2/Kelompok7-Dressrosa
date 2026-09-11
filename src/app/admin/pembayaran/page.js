"use client";

import { useEffect, useState } from "react";
import TabelPengajuan from "@/components/admin/TabelPengajuan";

export default function AdminPembayaranPage() {
  const [list, setList] = useState([]);

  function muatData() {
    fetch("/api/pengajuan").then((res) => res.json()).then((data) => setList(Array.isArray(data) ? data : []));
  }

  useEffect(() => {
    muatData();
  }, []);

  function handleVerifikasi(id) {
    fetch(`/api/pengajuan/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "DIPROSES" }),
    }).then(muatData);
  }

  const menungguVerifikasi = list.filter((p) => p.status === "MENUNGGU_VERIFIKASI");

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-slate-800">Verifikasi Pembayaran</h1>
      <p className="mb-6 text-sm text-slate-500">
        Pengajuan yang sudah upload bukti bayar, menunggu diverifikasi
      </p>

      <TabelPengajuan
        data={menungguVerifikasi}
        renderAksi={(p) => (
          <button
            onClick={() => handleVerifikasi(p.id)}
            className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700"
          >
            Verifikasi Lunas
          </button>
        )}
      />
    </div>
  );
}
