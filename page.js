"use client";

import { useEffect, useState } from "react";
import { getPengajuan, savePengajuan } from "@/lib/store";
import { formatRupiah, statusClass, statusLabel } from "@/lib/utils";

export default function Pembayaran() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getPengajuan());
  }, []);

  function verify(id) {
    const next = items.map((p) =>
      p.id === id ? { ...p, sudahBayar: true, status: "DIPROSES" } : p
    );
    savePengajuan(next);
    setItems(next);
  }

  return (
    <div>
      <h1 className="text-3xl font-black">Verifikasi Pembayaran</h1>

      <div className="mt-6 space-y-3">
        {items
          .filter((p) => p.status === "APPROVED" || p.sudahBayar)
          .map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-5"
            >
              <div>
                <b>
                  #{p.id} — {p.userNama}
                </b>
                <p className="text-sm text-slate-500">
                  Total {formatRupiah(p.totalBayar)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs ${statusClass(
                    p.status
                  )}`}
                >
                  {p.sudahBayar ? "Sudah bayar" : statusLabel[p.status]}
                </span>
                {p.status === "APPROVED" && !p.sudahBayar && (
                  <button
                    onClick={() => verify(p.id)}
                    className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white"
                  >
                    Verifikasi
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}