"use client";

import { useEffect, useState } from "react";
import {
  getPeminjamanLengkap,
  ubahStatusPeminjaman,
  buatPengecekan,
} from "@/lib/store";
import { formatTanggal } from "@/lib/utils";
import Button from "@/components/ui/Button";

function isTerlambat(p) {
  if (p.status !== "sedang_dipinjam") return false;

  const selesai = new Date(p.tanggalSelesai);
  const hariIni = new Date(new Date().toDateString());

  return selesai < hariIni;
}

function jumlahBarang(p) {
  return p.items.reduce((total, item) => total + item.qty, 0);
}

export default function Pengecekan() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    muatData();
  }, []);

  function muatData() {
    setLoading(true);

    getPeminjamanLengkap()
      .then((data) => {
        setItems(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function ubah(id, status) {
    setBusyId(id);

    try {
      await ubahStatusPeminjaman(id, status);
      muatData();
    } finally {
      setBusyId(null);
    }
  }

  async function selesaikanDenganKondisi(p, statusKondisi) {
    setBusyId(p.id);

    try {
      for (const item of p.items) {
        let catatan;

        if (statusKondisi === "baik") {
          catatan = "Kondisi baik dan lengkap";
        } else if (statusKondisi === "rusak") {
          catatan = "Rusak ringan, sebagian jaminan dipotong";
        } else {
          catatan = "Hilang/rusak berat";
        }

        await buatPengecekan({
          peminjamanId: p.id,
          barangId: item.barangId,
          statusKondisi: statusKondisi,
          catatan: catatan,
        });
      }

      await ubahStatusPeminjaman(p.id, "selesai");
      muatData();
    } finally {
      setBusyId(null);
    }
  }

  const siap = items.filter(
    (p) => p.status === "siap_diambil"
  );

  const dipinjam = items.filter(
    (p) => p.status === "sedang_dipinjam"
  );

  const kembali = items.filter(
    (p) => p.status === "dikembalikan"
  );

  return (
    <div>
      <h1 className="text-3xl font-black">
        Pengecekan Perlengkapan
      </h1>

      <p className="mt-1 text-sm text-slate-500">
        Konfirmasi serah terima barang dan catat kondisi barang
        saat dikembalikan.
      </p>

      {loading && (
        <p className="mt-6 text-sm text-slate-400">
          Memuat data...
        </p>
      )}

      {!loading && (
        <>
          {/* SIAP DIAMBIL */}
          <section className="mt-6">
            <h2 className="mb-3 font-bold">
              Siap Diambil / Dikirim
            </h2>

            <div className="space-y-3">
              {siap.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <b>#{p.id}</b>

                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                      {jumlahBarang(p)} barang
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    {p.items
                      .map((i) => `${i.nama} ×${i.qty}`)
                      .join(", ")}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Tanggal mulai:{" "}
                    <span className="font-medium text-slate-700">
                      {formatTanggal(p.tanggalMulai)}
                    </span>
                  </p>

                  <Button
                    className="mt-3"
                    disabled={busyId === p.id}
                    onClick={() =>
                      ubah(p.id, "sedang_dipinjam")
                    }
                  >
                    {busyId === p.id
                      ? "Memproses..."
                      : "Tandai Sudah Diserahkan"}
                  </Button>
                </div>
              ))}

              {!siap.length && (
                <p className="text-sm text-slate-400">
                  Tidak ada barang yang menunggu serah terima.
                </p>
              )}
            </div>
          </section>

          {/* SEDANG DIPINJAM */}
          <section className="mt-8">
            <h2 className="mb-3 font-bold">
              Sedang Dipinjam
            </h2>

            <div className="space-y-3">
              {dipinjam.map((p) => {
                const telat = isTerlambat(p);

                return (
                  <div
                    key={p.id}
                    className={`rounded-xl border bg-white p-5 shadow-sm ${
                      telat ? "border-orange-300" : ""
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <b>#{p.id}</b>

                      {telat && (
                        <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">
                          Terlambat
                        </span>
                      )}

                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                        {jumlahBarang(p)} barang
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      {p.items
                        .map((i) => `${i.nama} ×${i.qty}`)
                        .join(", ")}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Jatuh tempo:{" "}
                      <span
                        className={
                          telat
                            ? "font-semibold text-orange-600"
                            : "font-medium text-slate-700"
                        }
                      >
                        {formatTanggal(p.tanggalSelesai)}
                      </span>
                    </p>

                    <Button
                      className="mt-3"
                      disabled={busyId === p.id}
                      onClick={() =>
                        ubah(p.id, "dikembalikan")
                      }
                    >
                      {busyId === p.id
                        ? "Memproses..."
                        : "Tandai Sudah Dikembalikan"}
                    </Button>
                  </div>
                );
              })}

              {!dipinjam.length && (
                <p className="text-sm text-slate-400">
                  Tidak ada barang yang sedang dipinjam.
                </p>
              )}
            </div>
          </section>

          {/* PENGECEKAN KONDISI */}
          <section className="mt-8">
            <h2 className="mb-3 font-bold">
              Pengecekan Kondisi & Selesaikan
            </h2>

            <div className="space-y-3">
              {kembali.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <b>#{p.id}</b>

                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                      Menunggu pengecekan
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    {p.items
                      .map((i) => `${i.nama} ×${i.qty}`)
                      .join(", ")}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Total barang:{" "}
                    <span className="font-semibold text-slate-700">
                      {jumlahBarang(p)}
                    </span>
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      disabled={busyId === p.id}
                      onClick={() =>
                        selesaikanDenganKondisi(
                          p,
                          "baik"
                        )
                      }
                      className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                    >
                      {busyId === p.id
                        ? "Memproses..."
                        : "Kondisi Baik"}
                    </button>

                    <button
                      disabled={busyId === p.id}
                      onClick={() =>
                        selesaikanDenganKondisi(
                          p,
                          "rusak"
                        )
                      }
                      className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-600 disabled:opacity-50"
                    >
                      Rusak Ringan
                    </button>

                    <button
                      disabled={busyId === p.id}
                      onClick={() =>
                        selesaikanDenganKondisi(
                          p,
                          "hilang"
                        )
                      }
                      className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                    >
                      Hilang/Rusak Berat
                    </button>
                  </div>
                </div>
              ))}

              {!kembali.length && (
                <p className="text-sm text-slate-400">
                  Tidak ada barang yang menunggu pengecekan
                  kondisi.
                </p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}