import {
  formatRupiah,
  formatTanggal,
  statusClass,
  labelStatusPeminjaman,
} from "@/lib/utils";
import { linkWA, pesanKeUser } from "@/lib/whatsapp";

export default function TabelPengajuan({ items, onStatus, users = {} }) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="p-3">ID</th>
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
                <span className="text-xs text-slate-500">{users[p.userId]?.nama || `User ID ${p.userId}`}</span>
              </td>

              <td className="p-3">
                {formatTanggal(p.tanggalMulai)}
                <br />
                <span>s/d {formatTanggal(p.tanggalSelesai)}</span>
              </td>

              <td className="p-3">{formatRupiah(p.totalBayar)}</td>

              <td className="p-3">
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass(p.status)}`}>
                  {labelStatusPeminjaman(p)}
                </span>
              </td>

              <td className="p-3">
                <div className="flex gap-2">
                  {p.status === "menunggu_persetujuan" && (
                    <>
                      <button onClick={() => onStatus(p.id, "disetujui")} className="text-xs font-semibold text-blue-600">
                        Setujui
                      </button>
                      <button onClick={() => onStatus(p.id, "ditolak")} className="text-xs font-semibold text-red-600">
                        Tolak
                      </button>
                    </>
                  )}
                  {users[p.userId]?.noHp ? (
                    <a
                      href={linkWA(users[p.userId].noHp, pesanKeUser(p, users[p.userId].nama))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-green-600"
                    >
                      WhatsApp
                    </a>
                  ) : (
                    p.status !== "menunggu_persetujuan" && (
                      <span className="text-xs text-slate-400">-</span>
                    )
                  )}
                </div>
              </td>
            </tr>
          ))}

          {!items.length && (
            <tr>
              <td colSpan={5} className="p-6 text-center text-sm text-slate-400">
                Belum ada pengajuan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}