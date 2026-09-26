"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { getBarang } from "@/lib/store";
import { formatRupiah } from "@/lib/utils";

const manfaat = [
  { judul: "Daftar & masuk dalam semenit", teks: "Buat akun sekali, dipakai untuk semua pengajuan berikutnya. Data kamu tersimpan aman lewat API EVENTRA." },
  { judul: "Pilih alat, atur tanggal, selesai", teks: "Telusuri katalog lengkap dengan filter kategori, masukkan ke keranjang, lalu checkout dengan tanggal sewa yang kamu tentukan sendiri." },
  { judul: "Pantau tiap tahap pesanan", teks: "Dari menunggu persetujuan sampai barang kembali, semua tercatat di linimasa status dan bisa kamu lihat lagi lewat riwayat transaksi." },
  { judul: "Diperiksa sebelum & sesudah sewa", teks: "Tim petugas kami mengecek kondisi setiap alat sebelum berangkat dan saat kembali, jadi kualitasnya terjaga untuk penyewa berikutnya." },
];

export default function HomePage() {
  const [barang, setBarang] = useState([]);

  useEffect(() => {
    getBarang().then(setBarang).catch(() => setBarang([]));
  }, []);

  const kategoriList = [...new Set(barang.map((b) => b.kategori))];
  const hargaTermurah = barang.length ? Math.min(...barang.map((b) => b.hargaSewa)) : 0;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* HERO */}
        <section className="border-b bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                Sewa alat pesta tanpa ribet
              </span>

              <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
                Peralatan acara siap pakai,{" "}
                <span className="gradient-text">dipesan dari layar HP-mu.</span>
              </h1>

              <p className="mt-5 max-w-md text-lg leading-7 text-slate-600">
                EVENTRA menghubungkan kamu dengan lampu, sound system, meja
                kursi, sampai dekorasi untuk acara apa pun — mulai dari
                katalog sampai barang diantar kembali.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="btn-gradient rounded-lg px-5 py-3 font-semibold">
                  Masuk ke Akun
                </Link>
                <Link
                  href="/barang"
                  className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:border-indigo-300 hover:bg-indigo-50"
                >
                  Lihat Katalog
                </Link>
              </div>

              <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t pt-6">
                <div>
                  <dt className="text-2xl font-bold text-slate-900">{barang.length}+</dt>
                  <dd className="text-sm text-slate-500">Jenis alat</dd>
                </div>
                <div>
                  <dt className="text-2xl font-bold text-slate-900">{kategoriList.length}</dt>
                  <dd className="text-sm text-slate-500">Kategori</dd>
                </div>
                <div>
                  <dt className="text-2xl font-bold text-slate-900">24 jam</dt>
                  <dd className="text-sm text-slate-500">Respon pengajuan</dd>
                </div>
              </dl>
            </div>

            <div className="bg-soft-gradient relative mx-auto hidden h-[420px] w-full max-w-sm items-center justify-center rounded-2xl text-8xl shadow-inner md:flex">
              🎉
              {barang.length > 0 && (
                <div className="absolute bottom-8 right-2 rounded-xl bg-white px-4 py-3 shadow-lg">
                  <p className="text-xs text-slate-500">Mulai dari</p>
                  <p className="text-lg font-bold text-indigo-600">
                    {formatRupiah(hargaTermurah)}
                    <span className="text-xs font-normal text-slate-500"> / hari</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* KATALOG PILIHAN */}
        {barang.length > 0 && (
          <section className="mx-auto max-w-6xl px-6 py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Alat yang bisa kamu sewa</h2>
                <p className="mt-2 text-slate-600">Sebagian dari katalog EVENTRA yang siap disewa hari ini.</p>
              </div>
              <Link href="/barang" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                Lihat semua katalog →
              </Link>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {barang.slice(0, 4).map((b) => (
                <Link
                  key={b.id}
                  href={`/barang/${b.id}`}
                  className="card-hover group overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm"
                >
                  <div className="bg-soft-gradient h-36 overflow-hidden">
                    <img
                      src={b.foto}
                      alt={b.nama}
                      loading="lazy"
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-semibold uppercase text-indigo-600">{b.kategori}</p>
                    <h3 className="mt-1 line-clamp-1 text-sm font-bold text-slate-900">{b.nama}</h3>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {formatRupiah(b.hargaSewa)}
                      <span className="font-normal text-slate-400"> /hari</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* MANFAAT */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Satu alur, dari cari alat sampai alat kembali
            </h2>
            <p className="mt-3 text-slate-600">
              Semua yang kamu butuhkan untuk menyewa perlengkapan acara ada
              dalam satu tempat, tanpa harus bolak-balik chat admin.
            </p>
          </div>

          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2">
            {manfaat.map((item) => (
              <div key={item.judul} className="bg-white p-7">
                <h3 className="font-semibold text-slate-900">{item.judul}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.teks}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}