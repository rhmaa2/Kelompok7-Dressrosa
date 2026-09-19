import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { dataAlat } from "@/lib/dataAlat";
import { formatRupiah } from "@/lib/utils";

const manfaat = [
  {
    judul: "Daftar & masuk dalam semenit",
    teks: "Buat akun sekali, dipakai untuk semua pengajuan berikutnya. Data kamu tersimpan aman dan formulir divalidasi otomatis sebelum dikirim.",
  },
  {
    judul: "Pilih alat, atur tanggal, selesai",
    teks: "Telusuri katalog lengkap dengan filter kategori dan harga, masukkan ke keranjang, lalu checkout dengan tanggal sewa yang kamu tentukan sendiri.",
  },
  {
    judul: "Pantau tiap tahap pesanan",
    teks: "Dari menunggu persetujuan sampai barang kembali, semua tercatat di linimasa status dan bisa kamu lihat lagi lewat riwayat transaksi.",
  },
  {
    judul: "Diperiksa sebelum & sesudah sewa",
    teks: "Tim petugas kami mengecek kondisi setiap alat sebelum berangkat dan saat kembali, jadi kualitasnya terjaga untuk penyewa berikutnya.",
  },
];

const kategoriList = [...new Set(dataAlat.map((b) => b.kategori))];

const unggulan = dataAlat.slice(0, 4);

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">

      <main className="flex-1">
        {/* HERO */}
        <section className="border-b bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                Sewa alat pesta tanpa ribet
              </span>

              <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
                Peralatan acara siap pakai, dipesan dari layar HP-mu.
              </h1>

              <p className="mt-5 max-w-md text-lg leading-7 text-slate-600">
                EVENTRA menghubungkan kamu dengan lampu, sound system, meja
                kursi, sampai dekorasi untuk acara apa pun — mulai dari
                katalog sampai barang diantar kembali.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="rounded-lg border bg-blue-600 px-5 py-3 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Masuk ke Akun
                </Link>
              </div>

              <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t pt-6">
                <div>
                  <dt className="text-2xl font-bold text-slate-900">
                    {dataAlat.length}+
                  </dt>
                  <dd className="text-sm text-slate-500">Jenis alat</dd>
                </div>
                <div>
                  <dt className="text-2xl font-bold text-slate-900">
                    {kategoriList.length}
                  </dt>
                  <dd className="text-sm text-slate-500">Kategori</dd>
                </div>
                <div>
                  <dt className="text-2xl font-bold text-slate-900">24 jam</dt>
                  <dd className="text-sm text-slate-500">Respon pengajuan</dd>
                </div>
              </dl>
            </div>

            {/* Photo collage from real catalog items */}
            <div className="relative mx-auto hidden h-[420px] w-full max-w-sm md:block">
              <img
                src={unggulan[2]?.foto}
                alt={unggulan[2]?.nama_barang}
                className="absolute right-0 top-0 h-64 w-56 rounded-2xl object-cover shadow-xl"
              />
              <img
                src={unggulan[0]?.foto}
                alt={unggulan[0]?.nama_barang}
                className="absolute bottom-0 left-0 h-72 w-64 rounded-2xl object-cover shadow-xl ring-4 ring-white"
              />
              <div className="absolute bottom-8 right-2 rounded-xl bg-white px-4 py-3 shadow-lg">
                <p className="text-xs text-slate-500">Mulai dari</p>
                <p className="text-lg font-bold text-blue-600">
                  {formatRupiah(10000)}
                  <span className="text-xs font-normal text-slate-500">
                    {" "}
                    / hari
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MANFAAT — bukan daftar bernomor, tapi alasan pakai layanan */}
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

          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border bg-slate-200 sm:grid-cols-2">
            {manfaat.map((item) => (
              <div key={item.judul} className="bg-white p-7">
                <h3 className="font-semibold text-slate-900">{item.judul}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.teks}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}