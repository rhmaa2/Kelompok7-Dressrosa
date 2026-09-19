"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUser, ajukanJadiPetugas, getPengajuanPetugas, refreshRoleUser } from "@/lib/store";
import Button from "@/components/ui/Button";

export default function JadiPetugasPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sukses, setSukses] = useState(false);
  const [statusPengajuan, setStatusPengajuan] = useState(null); // pending | approved | rejected | null
  const [form, setForm] = useState({
    alasan: "",
    noHpPetugas: "",
  });

  useEffect(() => {
    const current = getCurrentUser();
    setUser(current);
    if (current?.id) {
      getPengajuanPetugas()
        .then((rows) => {
          // Pengajuan terbaru (id terbesar) milik user ini yang menentukan status.
          const milik = rows.filter((x) => String(x.user_id) === String(current.id));
          const terbaru = milik.sort((a, b) => Number(b.id) - Number(a.id))[0];
          setStatusPengajuan(terbaru?.status || null);
        })
        .catch(() => {});
      refreshRoleUser().then((u) => u && setUser(u));
    }
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function ajukan(e) {
    e.preventDefault();
    if (!user) return;

    setError("");

    if (!form.alasan.trim() || !form.noHpPetugas.trim()) {
      return setError("Alasan dan nomor HP wajib diisi.");
    }

    setLoading(true);
    try {
      await ajukanJadiPetugas(user, { noHpPetugas: form.noHpPetugas, alasan: form.alasan });
      setStatusPengajuan("pending");
      setSukses(true);
    } catch (err) {
      setError(err.message || "Gagal mengirim pengajuan ke server.");
    } finally {
      setLoading(false);
    }
  }

  if (user === null) {
    return <p className="p-12 text-center text-slate-400">Memuat...</p>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-black">Masuk dulu, yuk</h1>
        <p className="mt-2 text-sm text-slate-500">
          Kamu perlu masuk ke akunmu untuk bisa mengajukan diri menjadi petugas.
        </p>
        <Link
          href="/login"
          className="mt-5 inline-block rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Masuk
        </Link>
      </div>
    );
  }

  if (user.role === "petugas") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-black">Kamu sudah menjadi petugas</h1>
        <p className="mt-2 text-sm text-slate-500">
          Kamu tetap bisa memesan barang seperti penyewa biasa, dan membuka menu Petugas kapan saja.
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <Link href="/barang" className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white">
            Pesan Barang
          </Link>
          <Link href="/petugas/dashboard" className="rounded-lg border px-5 py-2.5 text-sm font-semibold">
            Dashboard Petugas
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== "user") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-black">Tidak berlaku untuk akunmu</h1>
        <p className="mt-2 text-sm text-slate-500">
          Halaman ini hanya untuk akun penyewa biasa yang ingin mengajukan diri
          menjadi petugas.
        </p>
      </div>
    );
  }

  if (statusPengajuan === "pending") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-black">Pengajuan sedang diproses</h1>
        <p className="mt-2 text-sm text-slate-500">Pengajuan kamu sudah masuk dan menunggu persetujuan admin.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">
        ← Beranda
      </Link>

      <h1 className="mt-4 text-3xl font-black text-slate-900">Jadi Petugas</h1>
      <p className="mt-2 text-sm text-slate-500">
        Petugas bertugas mengecek kondisi barang sebelum disewakan dan saat
        dikembalikan. Isi form di bawah. Pengajuan akan menunggu persetujuan admin.
      </p>

      {statusPengajuan === "rejected" && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Pengajuan kamu sebelumnya <b>ditolak</b> oleh admin. Kamu bisa mengajukan lagi di bawah ini.
        </p>
      )}

      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        {sukses ? (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            <p className="font-semibold">Pengajuan berhasil dikirim</p>
            <p className="mt-1">Status: <b>menunggu persetujuan admin</b>. Kamu belum menjadi petugas sampai pengajuan disetujui.</p>
          </div>
        ) : (
          <form onSubmit={ajukan} className="space-y-3">
            <p className="text-sm text-slate-600">
              Isi form di bawah untuk mengajukan diri menjadi petugas.
            </p>

            <Field
              name="alasan"
              label="Alasan ingin jadi petugas"
              value={form.alasan}
              onChange={handleChange}
              textarea
            />

            <Field
              name="noHpPetugas"
              label="Nomor HP aktif"
              value={form.noHpPetugas}
              onChange={handleChange}
            />

            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <Button disabled={loading} className="w-full">
              {loading ? "Mengirim..." : "Ajukan Diri Jadi Petugas"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ name, label, value, onChange, textarea = false, required = true }) {
  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-700">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          rows={3}
          className={inputClass}
        />
      ) : (
        <input
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={inputClass}
        />
      )}
    </label>
  );
}