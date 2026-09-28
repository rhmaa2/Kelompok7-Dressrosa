"use client";

import { useEffect, useState } from "react";
import { getUsers, updateUserRole } from "@/lib/store";

const ROLE_OPTIONS = ["user", "petugas", "admin"];

const ROLE_BADGE = {
  admin: "bg-indigo-100 text-indigo-700",
  petugas: "bg-blue-100 text-blue-700",
  user: "bg-slate-100 text-slate-600",
};

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [pilihan, setPilihan] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    muat();
  }, []);

  //mengambil data user dari API
  function muat() {
    setLoading(true);
    getUsers()
      .then((data) => {
        setUsers(data);
        const p = {};
        data.forEach((u) => (p[u.id] = u.role));
        setPilihan(p);
      })
      .finally(() => setLoading(false));
  }

  async function simpanRole(u) {
    setBusyId(u.id);
    setError("");
    try {
      await updateUserRole(u.id, {
        nama: u.nama,
        email: u.email,
        no_telepon: u.noHp || "-",
        role: pilihan[u.id],
      });
      muat();
    } catch (err) {
      setError(err.message || "Gagal menyimpan role.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-black text-slate-900">Manajemen User</h1>
      <p className="mt-1 text-sm text-slate-500">
        Daftar akun dari API EVENTRA. Ubah role langsung dari sini.
      </p>

      {error && (
        <p className="animate-fade-in mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <section className="mt-8">
        <div className="overflow-x-auto rounded-2xl border border-slate-200/70 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="p-4">Nama</th>
                <th className="p-4">Email</th>
                <th className="p-4">No. HP</th>
                <th className="p-4">Role</th>
                <th className="p-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-slate-100 transition hover:bg-slate-50/60">
                  <td className="p-4 font-semibold text-slate-800">{u.nama}</td>
                  <td className="p-4 text-slate-600">{u.email}</td>
                  <td className="p-4 text-slate-600">{u.noHp || "-"}</td>
                  <td className="p-4">
                    <span className={`mr-2 rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${ROLE_BADGE[u.role] || ROLE_BADGE.user}`}>
                      {u.role}
                    </span>
                    <select
                      value={pilihan[u.id] || u.role}
                      onChange={(e) => setPilihan({ ...pilihan, [u.id]: e.target.value })}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-sm capitalize outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    >
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => simpanRole(u)}
                      disabled={busyId === u.id || pilihan[u.id] === u.role}
                      className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:shadow-md disabled:opacity-40 disabled:shadow-none"
                    >
                      {busyId === u.id ? "Menyimpan..." : "Simpan"}
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && !users.length && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-sm text-slate-400">
                    Belum ada data user.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {loading && (
            <div className="space-y-2 p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-10 rounded-xl" />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}