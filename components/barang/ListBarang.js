import Link from "next/link";
import { formatRupiah } from "@/lib/utils";

export default function ListBarang({ items }) {
  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center text-slate-400">
        Barang tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((b) => (
        <article
          key={b.id}
          className="flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm"
        >
          <div className="flex h-40 items-center justify-center overflow-hidden bg-slate-100">
            <img src={b.gambar} alt={b.nama} className="h-full w-full object-cover" />
          </div>

          <div className="flex flex-1 flex-col p-5">
            <p className="text-xs font-semibold uppercase text-blue-600">
              {b.kategori}
            </p>

            <h2 className="mt-1 text-lg font-bold">{b.nama}</h2>

            <p className="mt-2 line-clamp-2 text-sm text-slate-500">
              {b.deskripsi}
            </p>

            <div className="mt-auto pt-4">
              <p className="font-bold text-slate-800">
                {formatRupiah(b.hargaSewa)}{" "}
                <span className="font-normal text-xs text-slate-400">/hari</span>
              </p>

              <p className="text-xs text-slate-500">Stok {b.stok}</p>

              <Link
                href={`/barang/${b.id}`}
                className="mt-3 block rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
              >
                Lihat Detail Barang
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}