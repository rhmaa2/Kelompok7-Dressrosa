"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getPeminjamanLengkap,
  ubahStatusPeminjaman,
  buatPengecekan,
} from "@/lib/store";
import { formatTanggal } from "@/lib/utils";
import Button from "@/components/ui/Button";

function isTerlambat(p) {
  if (p.status !== "sedang_dipinjam") {
    return false;
  }

  const selesai = new Date(p.tanggalSelesai);
  const hariIni = new Date(new Date().toDateString());

  return selesai < hariIni;
}

export default function Pengecekan() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const muatData = useCallback(() => {
    setLoading(true);

    getPeminjamanLengkap()
      .then((data) => {
        setItems(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    muatData();
  }, [muatData]);

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
          {/* ================================
              BARANG SIAP DIAMBIL / DIKIRIM
          ================================= */}
          <section className="mt-6">
            <h2 className="mb-3 font-bold">
              Siap Diambil / Dikirim
            </h2>

            <div className="space-y-3">
              {siap.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border bg-white p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <b>#{p.id}</b>

                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                      Siap Diserahkan
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    {p.items
                      .map(
                        (item) =>
                          `${item.nama} ×${item.qty}`
                      )
                      .join(", ")}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Mulai peminjaman:{" "}
                    <span className="font-medium text-slate-700">
                      {formatTanggal(p.tanggalMulai)}
                    </span>
                  </p>

                  <Button
                    className="mt-3"
                    disabled={busyId === p.id}
                    onClick={() =>
                      ubah(
                        p.id,
                        "sedang_dipinjam"
                      )
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
                  Tidak ada barang yang menunggu
                  serah terima.
                </p>
              )}
            </div>
          </section>

          {/* ================================
              BARANG SEDANG DIPINJAM
          ================================= */}
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
                    className={`rounded-xl border bg-white p-5 ${
                      telat
                        ? "border-orange-300"
                        : ""
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <b>#{p.id}</b>

                      {telat && (
                        <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-semibold text-orange-700">
                          Terlambat
                        </span>
                      )}

                      {!telat && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                          Sedang Dipinjam
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      {p.items
                        .map(
                          (item) =>
                            `${item.nama} ×${item.qty}`
                        )
                        .join(", ")}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Jatuh tempo{" "}
                      <span
                        className={
                          telat
                            ? "font-semibold text-orange-600"
                            : "font-medium text-slate-700"
                        }
                      >
                        {formatTanggal(
                          p.tanggalSelesai
                        )}
                      </span>
                    </p>

                    <Button
                      className="mt-3"
                      disabled={busyId === p.id}
                      onClick={() =>
                        ubah(
                          p.id,
                          "dikembalikan"
                        )
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
                  Tidak ada barang yang sedang
                  dipinjam.
                </p>
              )}
            </div>
          </section>

          {/* ================================
              PENGECEKAN KONDISI
          ================================= */}
          <section className="mt-8">
            <h2 className="mb-3 font-bold">
              Pengecekan Kondisi & Selesaikan
            </h2>

            <div className="space-y-3">
              {kembali.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border bg-white p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <b>#{p.id}</b>

                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700">
                      Menunggu Pengecekan
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    {p.items
                      .map(
                        (item) =>
                          `${item.nama} ×${item.qty}`
                      )
                      .join(", ")}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {/* KONDISI BAIK */}
                    <button
                      type="button"
                      disabled={busyId === p.id}
                      onClick={() =>
                        selesaikanDenganKondisi(
                          p,
                          "baik"
                        )
                      }
                      className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {busyId === p.id
                        ? "Memproses..."
                        : "Kondisi Baik"}
                    </button>

                    {/* RUSAK RINGAN */}
                    <button
                      type="button"
                      disabled={busyId === p.id}
                      onClick={() =>
                        selesaikanDenganKondisi(
                          p,
                          "rusak"
                        )
                      }
                      className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Rusak Ringan
                    </button>

                    {/* HILANG / RUSAK BERAT */}
                    <button
                      type="button"
                      disabled={busyId === p.id}
                      onClick={() =>
                        selesaikanDenganKondisi(
                          p,
                          "hilang"
                        )
                      }
                      className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Hilang/Rusak Berat
                    </button>
                  </div>
                </div>
              ))}

              {!kembali.length && (
                <p className="text-sm text-slate-400">
                  Tidak ada barang yang menunggu
                  pengecekan kondisi.
                </p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}