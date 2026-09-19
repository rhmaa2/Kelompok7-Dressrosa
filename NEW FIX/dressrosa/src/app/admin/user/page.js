"use client";

import { useEffect, useState } from "react";
import { getUsers, updateUserRole } from "@/lib/store";

const ROLE_OPTIONS = ["user", "petugas", "admin"];

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [pilihan, setPilihan] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    muat();
  }, []);

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
      <h1 className="text-3xl font-black">Manajemen User</h1>
      <p className="mt-1 text-sm text-slate-500">
        Daftar akun dari API EVENTRA. Ubah role langsung dari sini.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      <section className="mt-8">
        <h2 className="mb-3 font-bold">Semua User</h2>
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-3">Nama</th>
                <th className="p-3">Email</th>
                <th className="p-3">No. HP</th>
                <th className="p-3">Role</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3 font-semibold">{u.nama}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.noHp || "-"}</td>
                  <td className="p-3">
                    <select
                      value={pilihan[u.id] || u.role}
                      onChange={(e) =>
                        setPilihan({ ...pilihan, [u.id]: e.target.value })
                      }
                      className="rounded-lg border px-2 py-1 text-sm capitalize"
                    >
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => simpanRole(u)}
                      disabled={busyId === u.id || pilihan[u.id] === u.role}
                      className="rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-800 disabled:opacity-40"
                    >
                      {busyId === u.id ? "Menyimpan..." : "Simpan"}
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && !users.length && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-sm text-slate-400">
                    Belum ada data user.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {loading && (
            <p className="p-6 text-center text-sm text-slate-400">Memuat...</p>
          )}
        </div>
      </section>
    </div>
  );
}