"use client";

import { useEffect, useState } from "react";
import TabelPengajuan from "@/components/admin/TabelPengajuan";

export default function AdminPengajuanPage() {
  const [list, setList] = useState([]);

  function muatData() {
    fetch("/api/pengajuan").then((res) => res.json()).then((data) => setList(Array.isArray(data) ? data : []));
  }

  useEffect(() => {
    muatData();
  }, []);

  function ubahStatus(id, status) {
    fetch(`/api/pengajuan/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).then(muatData);
  }

  const pending = list.filter((p) => p.status === "PENDING");

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-slate-800">Pengajuan Peminjaman</h1>
      <p className="mb-6 text-sm text-slate-500">Verifikasi pengajuan yang menunggu persetujuan</p>

      <TabelPengajuan
        data={pending}
        renderAksi={(p) => (
          <div className="flex gap-2">
            <button
              onClick={() => ubahStatus(p.id, "APPROVED")}
              className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700"
            >
              Approve
            </button>
            <button
              onClick={() => ubahStatus(p.id, "REJECTED")}
              className="rounded-lg bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600"
            >
              Reject
            </button>
          </div>
        )}
      />
    </div>
  );
}
