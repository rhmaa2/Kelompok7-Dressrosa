"use client";

import { useEffect, useState } from "react";
import { getPeminjamanLengkap, getPembayaranList, verifikasiPembayaran } from "@/lib/store";
import { formatRupiah, statusClass, statusLabel, statusPembayaranLabel } from "@/lib/utils";

export default function Pembayaran() {
  const [items, setItems] = useState([]);
  const [pembayaran, setPembayaran] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    muat();
  }, []);

  function muat() {
    setLoading(true);
    Promise.all([getPeminjamanLengkap(), getPembayaranList()])
      .then(([p, bayar]) => {
        setItems(p);
        setPembayaran(bayar);
      })
      .finally(() => setLoading(false));
  }

  async function verify(pembayaranId, peminjaman) {
    setBusyId(pembayaranId);
    try {
      const bayar = pembayaran.find((x) => x.id === pembayaranId);
      await verifikasiPembayaran(pembayaranId, {
        peminjamanId: peminjaman.id,
        jumlahBayar: bayar?.jumlah_bayar ?? peminjaman.totalBayar,
        metodeBayar: bayar?.metode ?? bayar?.metode_bayar ?? "qris",
      });
      muat();
    } catch (err) {
      setError(err.message || "Gagal memverifikasi pembayaran.");
    } finally {
      setBusyId(null);
    }
  }

  const menunggu = items
    .map((p) => ({ p, bayar: pembayaran.find((b) => String(b.peminjaman_id) === String(p.id)) }))
    .filter((x) => x.bayar);

  return (
    <div>
      <h1 className="text-3xl font-black">Verifikasi Pembayaran</h1>
      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="mt-6 text-sm text-slate-400">Memuat...</p>
      ) : (
        <div className="mt-6 space-y-3">
          {menunggu.map(({ p, bayar }) => (
            <div
              key={bayar.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-5"
            >
              <div>
                <b>
                  #{p.id} — {bayar.metode_bayar}
                </b>
                <p className="text-sm text-slate-500">
                  Total {formatRupiah(bayar.jumlah_bayar)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs ${statusClass(p.status)}`}
                >
                  {bayar.status_pembayaran === "lunas"
                    ? "Sudah lunas"
                    : statusPembayaranLabel[bayar.status_pembayaran] || bayar.status_pembayaran}
                </span>
                {bayar.status_pembayaran !== "lunas" && (
                  <button
                    onClick={() => verify(bayar.id, p)}
                    disabled={busyId === bayar.id}
                    className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                  >
                    {busyId === bayar.id ? "Memproses..." : "Verifikasi"}
                  </button>
                )}
              </div>
            </div>
          ))}

          {!menunggu.length && (
            <p className="text-sm text-slate-400">Belum ada pembayaran masuk.</p>
          )}
        </div>
      )}
    </div>
  );
}