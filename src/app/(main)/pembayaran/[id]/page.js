"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getPengajuan, savePengajuan } from "@/lib/store";
import { formatRupiah } from "@/lib/utils";
import Button from "@/components/ui/Button";

const KATEGORI = [
  { key: "va", label: "Transfer Bank" },
  { key: "ewallet", label: "E-Wallet" },
  { key: "qris", label: "QRIS" },
  { key: "kartu", label: "Kartu Kredit/Debit" },
];

const BANK_LIST = [
  { kode: "bca", nama: "BCA", prefix: "39" },
  { kode: "mandiri", nama: "Mandiri", prefix: "889" },
  { kode: "bni", nama: "BNI", prefix: "8808" },
  { kode: "bri", nama: "BRI", prefix: "26215" },
];

const EWALLET_LIST = [
  { kode: "gopay", nama: "GoPay" },
  { kode: "ovo", nama: "OVO" },
  { kode: "dana", nama: "DANA" },
  { kode: "shopeepay", nama: "ShopeePay" },
];

function buatNomorVA(kodeBank, id) {
  const bank = BANK_LIST.find((b) => b.kode === kodeBank) || BANK_LIST[0];
  const ekor = String(id).slice(-10).padStart(10, "0");
  return `${bank.prefix}${ekor}`;
}

export default function PembayaranPage() {
  const { id } = useParams();
  const router = useRouter();

  const [p, setP] = useState(null);
  const [kategori, setKategori] = useState("va");
  const [bank, setBank] = useState(BANK_LIST[0].kode);
  const [ewallet, setEwallet] = useState(EWALLET_LIST[0].kode);
  const [copied, setCopied] = useState(false);
  const [proses, setProses] = useState(false);

  useEffect(() => {
    const found = getPengajuan().find((x) => String(x.id) === String(id));
    setP(found || false);
  }, [id]);

  const nomorVA = useMemo(() => (p ? buatNomorVA(bank, p.id) : ""), [bank, p]);

  if (p === null) {
    return <p className="p-12 text-center text-slate-400">Memuat...</p>;
  }

  if (p === false) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-slate-500">Pengajuan tidak ditemukan.</p>
        <Link href="/status" className="mt-3 inline-block font-semibold text-blue-600">
          Kembali ke status
        </Link>
      </div>
    );
  }

  if (p.sudahBayar) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <p className="text-3xl">✅</p>
          <h1 className="mt-3 text-xl font-black">Pembayaran sudah diterima</h1>
          <p className="mt-2 text-sm text-slate-500">
            Pengajuan #{p.id} sudah lunas dan sedang diproses.
          </p>
          <Link
            href={`/status/${p.id}`}
            className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Lihat status pengajuan
          </Link>
        </div>
      </div>
    );
  }

  if (p.status !== "APPROVED") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-xl font-black">Belum bisa dibayar</h1>
          <p className="mt-2 text-sm text-slate-500">
            Pengajuan ini masih menunggu persetujuan admin. Pembayaran baru bisa
            dilakukan setelah pengajuan disetujui.
          </p>
          <Link href={`/status/${p.id}`} className="mt-5 inline-block font-semibold text-blue-600">
            ← Kembali ke detail pengajuan
          </Link>
        </div>
      </div>
    );
  }

  function salinVA() {
    if (navigator.clipboard) navigator.clipboard.writeText(nomorVA);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function konfirmasiBayar() {
    setProses(true);
    const list = getPengajuan();
    const next = list.map((x) =>
      x.id === p.id
        ? { ...x, sudahBayar: true, status: x.status === "APPROVED" ? "DIPROSES" : x.status }
        : x
    );
    savePengajuan(next);
    setTimeout(() => router.push(`/status/${p.id}`), 500);
  }

  const namaBank = BANK_LIST.find((b) => b.kode === bank)?.nama;
  const namaEwallet = EWALLET_LIST.find((w) => w.kode === ewallet)?.nama;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href={`/status/${p.id}`} className="text-sm text-slate-500 hover:text-slate-700">
        ← Detail pengajuan
      </Link>

      <h1 className="mt-4 text-2xl font-black">Selesaikan Pembayaran</h1>
      <p className="mt-1 text-sm text-slate-500">
        Pengajuan #{p.id} — pilih salah satu metode pembayaran di bawah ini.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          {/* Tab kategori metode */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {KATEGORI.map((k) => (
              <button
                key={k.key}
                onClick={() => setKategori(k.key)}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                  kategori === k.key
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>

          <div className="rounded-xl border bg-white p-5">
            {kategori === "va" && (
              <div>
                <p className="text-sm font-semibold">Pilih bank</p>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {BANK_LIST.map((b) => (
                    <button
                      key={b.kode}
                      onClick={() => setBank(b.kode)}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                        bank === b.kode
                          ? "border-blue-600 text-blue-700"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {b.nama}
                    </button>
                  ))}
                </div>

                <div className="mt-4 rounded-lg bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Nomor Virtual Account {namaBank}
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-lg font-black tracking-wider">{nomorVA}</p>
                    <button
                      onClick={salinVA}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      {copied ? "Tersalin!" : "Salin"}
                    </button>
                  </div>
                </div>

                <ol className="mt-4 list-decimal space-y-1 pl-4 text-xs text-slate-500">
                  <li>Buka aplikasi m-banking atau kunjungi ATM {namaBank}.</li>
                  <li>Pilih menu Transfer → Virtual Account.</li>
                  <li>Masukkan nomor Virtual Account di atas.</li>
                  <li>Periksa nominal tagihan, lalu selesaikan pembayaran.</li>
                </ol>
              </div>
            )}

            {kategori === "ewallet" && (
              <div>
                <p className="text-sm font-semibold">Pilih e-wallet</p>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {EWALLET_LIST.map((w) => (
                    <button
                      key={w.kode}
                      onClick={() => setEwallet(w.kode)}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                        ewallet === w.kode
                          ? "border-blue-600 text-blue-700"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {w.nama}
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex flex-col items-center rounded-lg bg-slate-50 p-6 text-center">
                  <div className="flex h-28 w-28 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-3xl">
                    📱
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    Scan kode di atas lewat aplikasi {namaEwallet}, atau buka
                    langsung aplikasinya untuk menyelesaikan pembayaran.
                  </p>
                  <button className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800">
                    Buka Aplikasi {namaEwallet}
                  </button>
                </div>
              </div>
            )}

            {kategori === "qris" && (
              <div className="flex flex-col items-center text-center">
                <div className="flex h-40 w-40 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-5xl">
                  ▦
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Scan kode QRIS di atas menggunakan aplikasi m-banking atau
                  e-wallet apa pun yang mendukung QRIS.
                </p>
              </div>
            )}

            {kategori === "kartu" && (
              <div className="space-y-3">
                <label className="block text-xs font-medium text-slate-600">
                  Nomor kartu
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-xs font-medium text-slate-600">
                    Berlaku hingga
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="block text-xs font-medium text-slate-600">
                    CVV
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="123"
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                    />
                  </label>
                </div>
                <p className="text-xs text-slate-400">
                  Transaksi kartu diproses melalui mitra payment gateway pihak
                  ketiga yang aman dan terenkripsi.
                </p>
              </div>
            )}
          </div>

          <p className="text-center text-xs text-slate-400">
            Pembayaran diproses melalui mitra payment gateway pihak ketiga
            (mis. Midtrans/Xendit) dan metode lainnya sesuai pilihan di atas.
          </p>
        </div>

        <aside className="h-fit space-y-4 rounded-xl border bg-white p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Ringkasan
            </p>
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Total sewa</span>
                <span>{formatRupiah(p.totalSewa)}</span>
              </div>
              <div className="flex justify-between">
                <span>Jaminan</span>
                <span>{formatRupiah(p.totalJaminan)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t pt-2 text-base font-bold">
                <span>Total bayar</span>
                <span className="text-blue-600">{formatRupiah(p.totalBayar)}</span>
              </div>
            </div>
          </div>

          <Button onClick={konfirmasiBayar} disabled={proses} className="w-full">
            {proses ? "Memproses..." : "Saya Sudah Membayar"}
          </Button>
          <p className="text-center text-[11px] text-slate-400">
            Status pembayaran akan diverifikasi oleh admin setelah dikonfirmasi.
          </p>
        </aside>
      </div>
    </div>
  );
}
