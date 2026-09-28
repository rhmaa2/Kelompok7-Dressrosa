import Link from "next/link";
import { formatRupiah } from "@/lib/utils";

const KONDISI_LABEL = { baik: "Baik", rusak: "Rusak", perbaikan: "Perbaikan" };

export default function ListBarang({ items }) {
  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
        Barang tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((b) => (
        <article
          key={b.id}
          className="card-hover flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm"
        >
          <div className="bg-soft-gradient h-32 overflow-hidden">
            {b.foto ? (
              <img src={b.foto} alt={b.nama} className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <div className="flex h-full items-center justify-center text-4xl text-indigo-200">📦</div>
            )}
          </div>

          <div className="flex flex-1 flex-col p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              {b.kategori}
            </p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">{b.nama}</h2>
            <p className="mt-2 text-xs text-slate-500">
              Kondisi: {KONDISI_LABEL[b.kondisi] || b.kondisi}
            </p>

            <div className="mt-auto pt-4">
              <p className="font-bold text-slate-800">
                {formatRupiah(b.hargaSewa)}{" "}
                <span className="font-normal text-xs text-slate-400">/hari</span>
              </p>
              <p className="text-xs text-slate-500">Stok tersedia {b.stokTersedia}</p>
              <Link
                href={`/barang/${b.id}`}
                className="btn-gradient mt-3 block rounded-lg px-4 py-2 text-center text-sm font-semibold"
              >
                Lihat Detail
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}