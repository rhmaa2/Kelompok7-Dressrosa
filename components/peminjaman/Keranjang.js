import { formatRupiah } from "@/lib/utils";

export default function Keranjang({ item, onQty, onRemove }) {
  return (
    <div className="flex gap-4 border-b py-4 last:border-0">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
        <img src={item.gambar} alt={item.nama} className="h-full w-full object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-semibold">{item.nama}</h3>
        <p className="text-sm text-blue-600">{formatRupiah(item.hargaSewa)}/hari</p>

        <div className="mt-2 flex items-center gap-3">
          <button
            onClick={() => onQty(Math.max(1, item.qty - 1))}
            className="h-7 w-7 rounded border"
          >
            −
          </button>

          <span className="text-sm">{item.qty}</span>

          <button onClick={() => onQty(item.qty + 1)} className="h-7 w-7 rounded border">
            +
          </button>

          <button onClick={onRemove} className="ml-2 text-xs text-red-500">
            Hapus
          </button>
        </div>
      </div>

      <p className="font-semibold">{formatRupiah(item.hargaSewa * item.qty)}</p>
    </div>
  );
}

