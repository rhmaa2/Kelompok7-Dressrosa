"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getPengajuan, savePengajuan } from "@/lib/store";
import { formatRupiah } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface PengajuanData {
  id: string | number;
  sudahBayar: boolean;
  status: string;
  totalSewa: number;
  totalJaminan: number;
  totalBayar: number;
  [key: string]: any;
}

const PAYMENT_CATEGORIES = [
  { key: "va", label: "Transfer Bank" },
  { key: "ewallet", label: "E-Wallet" },
  { key: "qris", label: "QRIS" },
  { key: "kartu", label: "Kartu Kredit/Debit" },
];

const BANK_OPTIONS = [
  { code: "bca", name: "BCA", prefix: "39" },
  { code: "mandiri", name: "Mandiri", prefix: "889" },
  { code: "bni", name: "BNI", prefix: "8808" },
  { code: "bri", name: "BRI", prefix: "26215" },
];

const EWALLET_OPTIONS = [
  { code: "gopay", name: "GoPay" },
  { code: "ovo", name: "OVO" },
  { code: "dana", name: "DANA" },
  { code: "shopeepay", name: "ShopeePay" },
];

function generateVirtualAccountNumber(bankCode: string, submissionId: string | number): string {
  const selectedBank = BANK_OPTIONS.find((b) => b.code === bankCode) || BANK_OPTIONS[0];
  const suffix = String(submissionId).slice(-10).padStart(10, "0");
  return `${selectedBank.prefix}${suffix}`;
}

export default function PembayaranPage() {
  const { id } = useParams();
  const router = useRouter();

  const [submission, setSubmission] = useState<PengajuanData | null | false>(null);
  const [selectedCategory, setSelectedCategory] = useState("va");
  const [selectedBankCode, setSelectedBankCode] = useState(BANK_OPTIONS[0].code);
  const [selectedEwalletCode, setSelectedEwalletCode] = useState(EWALLET_OPTIONS[0].code);
  const [isCopied, setIsCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const foundSubmission = getPengajuan().find((item) => String(item.id) === String(id));
    setSubmission(foundSubmission || false);
  }, [id]);

  const virtualAccountNumber = useMemo(
    () => (submission ? generateVirtualAccountNumber(selectedBankCode, submission.id) : ""),
    [selectedBankCode, submission]
  );

  if (submission === null) {
    return <p className="p-12 text-center text-slate-400">Memuat...</p>;
  }

  if (submission === false) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-slate-500">Pengajuan tidak ditemukan.</p>
        <Link href="/status" className="mt-3 inline-block font-semibold text-blue-600">
          Kembali ke status
        </Link>
      </div>
    );
  }

  if (submission.sudahBayar) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <p className="text-3xl">✅</p>
          <h1 className="mt-3 text-xl font-black">Pembayaran sudah diterima</h1>
          <p className="mt-2 text-sm text-slate-500">
            Pengajuan #{submission.id} sudah lunas dan sedang diproses.
          </p>
          <Link
            href={`/status/${submission.id}`}
            className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Lihat status pengajuan
          </Link>
        </div>
      </div>
    );
  }

  if (submission.status !== "APPROVED") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-xl font-black">Belum bisa dibayar</h1>
          <p className="mt-2 text-sm text-slate-500">
            Pengajuan ini masih menunggu persetujuan admin. Pembayaran baru bisa
            dilakukan setelah pengajuan disetujui.
          </p>
          <Link href={`/status/${submission.id}`} className="mt-5 inline-block font-semibold text-blue-600">
            ← Kembali ke detail pengajuan
          </Link>
        </div>
      </div>
    );
  }

  function handleCopyVA() {
    if (navigator.clipboard) navigator.clipboard.writeText(virtualAccountNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  }

  function handleConfirmPayment() {
    setIsProcessing(true);
    const list = getPengajuan();
    const updatedList = list.map((item) =>
      item.id === submission.id
        ? { ...item, sudahBayar: true, status: item.status === "APPROVED" ? "DIPROSES" : item.status }
        : item
    );
    savePengajuan(updatedList);
    setTimeout(() => router.push(`/status/${submission.id}`), 500);
  }

  const selectedBankName = BANK_OPTIONS.find((b) => b.code === selectedBankCode)?.name;
  const selectedEwalletName = EWALLET_OPTIONS.find((w) => w.code === selectedEwalletCode)?.name;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href={`/status/${submission.id}`} className="text-sm text-slate-500 hover:text-slate-700">
        ← Detail pengajuan
      </Link>

      <h1 className="mt-4 text-2xl font-black">Selesaikan Pembayaran</h1>
      <p className="mt-1 text-sm text-slate-500">
        Pengajuan #{submission.id} — pilih salah satu metode pembayaran di bawah ini.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          {/* Tab kategori metode */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PAYMENT_CATEGORIES.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                  selectedCategory === category.key
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="rounded-xl border bg-white p-5">
            {selectedCategory === "va" && (
              <div>
                <p className="text-sm font-semibold">Pilih bank</p>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {BANK_OPTIONS.map((bank) => (
                    <button
                      key={bank.code}
                      onClick={() => setSelectedBankCode(bank.code)}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                        selectedBankCode === bank.code
                          ? "border-blue-600 text-blue-700"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {bank.name}
                    </button>
                  ))}
                </div>

                <div className="mt-4 rounded-lg bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Nomor Virtual Account {selectedBankName}
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-lg font-black tracking-wider">{virtualAccountNumber}</p>
                    <button
                      onClick={handleCopyVA}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      {isCopied ? "Tersalin!" : "Salin"}
                    </button>
                  </div>
                </div>

                <ol className="mt-4 list-decimal space-y-1 pl-4 text-xs text-slate-500">
                  <li>Buka aplikasi m-banking atau kunjungi ATM {selectedBankName}.</li>
                  <li>Pilih menu Transfer → Virtual Account.</li>
                  <li>Masukkan nomor Virtual Account di atas.</li>
                  <li>Periksa nominal tagihan, lalu selesaikan pembayaran.</li>
                </ol>
              </div>
            )}

            {selectedCategory === "ewallet" && (
              <div>
                <p className="text-sm font-semibold">Pilih e-wallet</p>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {EWALLET_OPTIONS.map((ewallet) => (
                    <button
                      key={ewallet.code}
                      onClick={() => setSelectedEwalletCode(ewallet.code)}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                        selectedEwalletCode === ewallet.code
                          ? "border-blue-600 text-blue-700"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {ewallet.name}
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex flex-col items-center rounded-lg bg-slate-50 p-6 text-center">
                  <div className="flex h-28 w-28 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-3xl">
                    📱
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    Scan kode di atas lewat aplikasi {selectedEwalletName}, atau buka
                    langsung aplikasinya untuk menyelesaikan pembayaran.
                  </p>
                  <button className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800">
                    Buka Aplikasi {selectedEwalletName}
                  </button>
                </div>
              </div>
            )}

            {selectedCategory === "qris" && (
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

            {selectedCategory === "kartu" && (
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
                <span>{formatRupiah(submission.totalSewa)}</span>
              </div>
              <div className="flex justify-between">
                <span>Jaminan</span>
                <span>{formatRupiah(submission.totalJaminan)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t pt-2 text-base font-bold">
                <span>Total bayar</span>
                <span className="text-blue-600">{formatRupiah(submission.totalBayar)}</span>
              </div>
            </div>
          </div>

          <Button onClick={handleConfirmPayment} disabled={isProcessing} className="w-full">
            {isProcessing ? "Memproses..." : "Saya Sudah Membayar"}
          </Button>
          <p className="text-center text-[11px] text-slate-400">
            Status pembayaran akan diverifikasi oleh admin setelah dikonfirmasi.
          </p>
        </aside>
      </div>
    </div>
  );
}