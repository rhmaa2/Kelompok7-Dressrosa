import { formatRupiah } from "@/lib/utils";

export default function Keranjang({ item, onQty, onRemove }) {
  return (
    <div className="flex gap-4 border-b border-slate-200 py-4 last:border-0">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
        <img 
          src={item.gambar} 
          alt={item.nama} 
          className="h-full w-full object-cover" 
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-slate-900">{item.nama}</h3>
        <p className="text-sm text-blue-600">{formatRupiah(item.hargaSewa)}/hari</p>

        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onQty(Math.max(1, item.qty - 1))}
            className="flex h-7 w-7 items-center justify-center rounded border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
          >
            −
          </button>

          <span className="text-sm font-medium text-slate-900">{item.qty}</span>

          <button 
            type="button"
            onClick={() => onQty(item.qty + 1)} 
            className="flex h-7 w-7 items-center justify-center rounded border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
          >
            +
          </button>

          <button 
            type="button"
            onClick={onRemove} 
            className="ml-2 text-xs font-medium text-red-500 hover:text-red-700 transition"
          >
            Hapus
          </button>
        </div>
      </div>

      <p className="font-semibold text-slate-900">{formatRupiah(item.hargaSewa * item.qty)}</p>
    </div>
  );
}