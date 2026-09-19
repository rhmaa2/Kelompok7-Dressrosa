"use client";

import { useEffect, useState } from "react";
import { getUsers, setujuiPetugas, tolakPetugas } from "@/lib/store";

export default function UserPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  function setujui(id) {
    setujuiPetugas(id);
    setUsers(getUsers());
  }

  function tolak(id) {
    tolakPetugas(id);
    setUsers(getUsers());
  }

  const pending = users.filter((u) => u.statusPetugas === "pending");

  return (
    <div>
      <h1 className="text-3xl font-black">Manajemen User</h1>
      <p className="mt-1 text-sm text-slate-500">
        Daftar akun dan permintaan menjadi petugas.
      </p>

      <section className="mt-6">
        <h2 className="mb-3 font-bold">Permintaan Jadi Petugas</h2>
        <div className="space-y-3">
          {pending.map((u) => (
            <div
              key={u.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4"
            >
              <div>
                <b>{u.nama}</b>
                <p className="text-sm text-slate-500">{u.email}</p>
                {u.pengajuanPetugas?.alasan && (
                  <p className="mt-2 text-sm text-slate-600">
                    <span className="font-semibold">Alasan: </span>
                    {u.pengajuanPetugas.alasan}
                  </p>
                )}
                {u.pengajuanPetugas?.pengalaman && (
                  <p className="mt-1 text-sm text-slate-600">
                    <span className="font-semibold">Pengalaman: </span>
                    {u.pengajuanPetugas.pengalaman}
                  </p>
                )}
                {u.pengajuanPetugas?.noHpPetugas && (
                  <p className="mt-1 text-sm text-slate-600">
                    <span className="font-semibold">No HP: </span>
                    {u.pengajuanPetugas.noHpPetugas}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setujui(u.id)}
                  className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-800"
                >
                  Setujui
                </button>
                <button
                  onClick={() => tolak(u.id)}
                  className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                >
                  Tolak
                </button>
              </div>
            </div>
          ))}
          {!pending.length && (
            <p className="text-sm text-slate-400">
              Tidak ada permintaan yang menunggu persetujuan.
            </p>
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 font-bold">Semua User</h2>
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-3">Nama</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status Petugas</th>
                <th className="p-3">Alamat</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3 font-semibold">{u.nama}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 capitalize">{u.role}</td>
                  <td className="p-3">
                    {u.statusPetugas && u.statusPetugas !== "none"
                      ? u.statusPetugas
                      : "-"}
                  </td>
                  <td className="p-3">{u.alamat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
