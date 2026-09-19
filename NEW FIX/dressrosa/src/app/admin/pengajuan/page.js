"use client";

import { useEffect, useState } from "react";
import {
  getPeminjamanLengkap,
  ubahStatusPeminjaman,
  getPengajuanPetugas,
  getUsers,
  reviewPengajuanPetugas,
  getCurrentUser,
} from "@/lib/store";
import TabelPengajuan from "@/components/admin/TabelPengajuan";

export default function AdminPengajuan() {
  const [items, setItems] = useState([]);
  const [staff, setStaff] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => { muat(); }, []);

  async function muat() {
    setLoading(true); setError("");
    try {
      const [p, s, u] = await Promise.all([getPeminjamanLengkap(), getPengajuanPetugas(), getUsers()]);
      setItems(p); setStaff(s); setUsers(u);
    } catch (err) {
      setError(err.message || "Gagal memuat data pengajuan.");
    } finally { setLoading(false); }
  }

  async function status(id, statusBaru) {
    setBusyId(`p-${id}`);
    setError("");
    try { await ubahStatusPeminjaman(id, statusBaru); await muat(); }
    catch (err) { setError(err.message || "Gagal mengubah status pengajuan."); }
    finally { setBusyId(null); }
  }

  async function review(pengajuan, statusBaru) {
    setBusyId(`s-${pengajuan.id}`); setError("");
    try {
      await reviewPengajuanPetugas(pengajuan, statusBaru, getCurrentUser());
      await muat();
    } catch (err) {
      setError(err.message || "Gagal memproses pengajuan petugas. API mungkin membatasi perubahan pengajuan.");
    } finally { setBusyId(null); }
  }

  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
  const terbaruMap = {};
  staff.forEach((x) => {
    const k = String(x.user_id);
    if (!terbaruMap[k] || Number(x.id) > Number(terbaruMap[k].id)) terbaruMap[k] = x;
  });
  const staffTerbaru = Object.values(terbaruMap).sort((a, b) => Number(b.id) - Number(a.id));

  return (
    <div>
      <h1 className="text-3xl font-black">Verifikasi Pengajuan</h1>
      <p className="mt-1 mb-6 text-sm text-slate-500">Kelola pengajuan peminjaman dan pengajuan menjadi petugas.</p>

      {error && <p className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      <section>
        <h2 className="mb-3 text-xl font-bold">Pengajuan Menjadi Petugas</h2>
        {loading ? <p className="text-sm text-slate-400">Memuat...</p> : (
          <div className="overflow-x-auto rounded-xl border bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>
                <th className="p-3">User</th><th className="p-3">Alasan</th><th className="p-3">Status</th><th className="p-3">Aksi</th>
              </tr></thead>
              <tbody>
                {staffTerbaru.map((x) => { const u = userMap[x.user_id]; return (
                  <tr key={x.id} className="border-t">
                    <td className="p-3"><b>{u?.nama || `User #${x.user_id}`}</b><br/><span className="text-xs text-slate-500">{u?.email || ""}</span></td>
                    <td className="max-w-md p-3">{x.catatan || "-"}</td>
                    <td className="p-3 capitalize">{x.status}</td>
                    <td className="p-3"><div className="flex gap-2">
                      {x.status !== "approved" && <button disabled={busyId === `s-${x.id}`} onClick={() => review(x, "approved")} className="rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40">Setujui</button>}
                      {x.status !== "rejected" && <button disabled={busyId === `s-${x.id}`} onClick={() => review(x, "rejected")} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40">{x.status === "approved" ? "Cabut" : "Tolak"}</button>}
                    </div></td>
                  </tr>
                ); })}
                {!staffTerbaru.length && <tr><td colSpan={4} className="p-6 text-center text-sm text-slate-400">Belum ada pengajuan petugas.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-xl font-bold">Pengajuan Peminjaman</h2>
        {loading ? <p className="text-sm text-slate-400">Memuat...</p> : <TabelPengajuan items={items} users={userMap} onStatus={status} />}
      </section>
    </div>
  );
}