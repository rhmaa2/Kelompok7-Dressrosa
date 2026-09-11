"use client";

import { useEffect, useState } from "react";
import { formatTanggal } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function PengecekanPage() {
  const [list, setList] = useState([]);
  const [catatan, setCatatan] = useState({});

  function muatData() {
    fetch("/api/pengajuan").then((res) => res.json()).then((data) => setList(Array.isArray(data) ? data : []));
  }

  useEffect(() => {
    muatData();
  }, []);

  function handleCatatanChange(id, value) {
    setCatatan((prev) => ({ ...prev, [id]: value }));
  }

  function updateStatus(id, patch) {
    fetch(`/api/pengajuan/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    }).then(muatData);
  }

  function handleSiapKirim(p) {
    updateStatus(p.id, { status: "SIAP", kondisiAwal: catatan[p.id] || "Kondisi baik, lengkap" });
  }

  function handlePengembalian(p, kondisi) {
    updateStatus(p.id, { status: "COMPLETED", kondisiAkhir: kondisi });
  }

  const perluDisiapkan = list.filter((p) => p.status === "DIPROSES");
  const perluDicekKembali = list.filter((p) => p.status === "SEDANG_DISEWA");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-1 text-2xl font-bold text-slate-800">Pengecekan Barang</h1>
        <p className="text-sm text-slate-500">Cek kondisi barang sebelum kirim/ambil dan saat pengembalian</p>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Barang Keluar (Siap Kirim/Diambil)</h2>
        {perluDisiapkan.length === 0 ? (
          <p className="text-sm text-slate-400">Tidak ada barang yang perlu disiapkan.</p>
        ) : (
          <div className="space-y-3">
            {perluDisiapkan.map((p) => (
              <Card key={p.id}>
                <p className="mb-1 font-medium text-slate-800">
                  #{p.id} — {p.userNama}
                </p>
                <p className="mb-2 text-sm text-slate-500">
                  {p.items.map((it) => `${it.nama} x${it.qty}`).join(", ")} — {formatTanggal(p.tanggalMulai)}
                </p>
                <textarea
                  placeholder="Catatan kondisi barang sebelum dikirim (opsional)"
                  value={catatan[p.id] || ""}
                  onChange={(e) => handleCatatanChange(p.id, e.target.value)}
                  className="mb-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={2}
                />
                <Button className="w-auto px-4" onClick={() => handleSiapKirim(p)}>
                  Tandai Siap {p.metode === "antar" ? "Dikirim" : "Diambil"}
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Barang Kembali (Cek Kondisi Akhir)</h2>
        {perluDicekKembali.length === 0 ? (
          <p className="text-sm text-slate-400">Tidak ada barang yang perlu dicek pengembaliannya.</p>
        ) : (
          <div className="space-y-3">
            {perluDicekKembali.map((p) => (
              <Card key={p.id}>
                <p className="mb-1 font-medium text-slate-800">
                  #{p.id} — {p.userNama}
                </p>
                <p className="mb-3 text-sm text-slate-500">
                  {p.items.map((it) => `${it.nama} x${it.qty}`).join(", ")} — jatuh tempo {formatTanggal(p.tanggalSelesai)}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handlePengembalian(p, "Baik, jaminan dikembalikan penuh")}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                  >
                    Kondisi Baik
                  </button>
                  <button
                    onClick={() => handlePengembalian(p, "Rusak ringan, sebagian jaminan dipotong")}
                    className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-600"
                  >
                    Rusak Ringan
                  </button>
                  <button
                    onClick={() => handlePengembalian(p, "Hilang/rusak berat, jaminan tidak dikembalikan")}
                    className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600"
                  >
                    Hilang / Rusak Berat
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
