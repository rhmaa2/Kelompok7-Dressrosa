import {
  formatRupiah,
  formatTanggal,
  statusClass,
  statusLabel,
} from "@/lib/utils";

export default function TabelPengajuan({ items, onStatus }) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="p-3">ID/User</th>
            <th className="p-3">Tanggal</th>
            <th className="p-3">Total</th>
            <th className="p-3">Status</th>
            <th className="p-3">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {items.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3">
                <b>#{p.id}</b>
                <br />
                <span className="text-xs text-slate-500">{p.userNama}</span>
              </td>

              <td className="p-3">
                {formatTanggal(p.tanggalMulai)}
                <br />
                <span>s/d {formatTanggal(p.tanggalSelesai)}</span>
              </td>

              <td className="p-3">{formatRupiah(p.totalBayar)}</td>

              <td className="p-3">
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass(p.status)}`}>
                  {statusLabel[p.status] || p.status}
                </span>
              </td>

              <td className="p-3">
                <div className="flex gap-2">
                  {p.status === "PENDING" && (
                    <>
                      <button onClick={() => onStatus(p.id, "APPROVED")} className="text-xs font-semibold text-blue-600">
                        Approve
                      </button>
                      <button onClick={() => onStatus(p.id, "REJECTED")} className="text-xs font-semibold text-red-600">
                        Reject
                      </button>
                    </>
                  )}

                  {p.status === "APPROVED" && !p.sudahBayar && (
                    <button onClick={() => onStatus(p.id, "DIPROSES")} className="text-xs font-semibold text-blue-600">
                      Verifikasi Bayar
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}