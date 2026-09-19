"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUser, ajukanJadiPetugas } from "@/lib/store";
import Button from "@/components/ui/Button";

const PESAN_STATUS = {
  pending: {
    judul: "Pengajuan sedang ditinjau",
    teks: "Permintaanmu untuk menjadi petugas sudah dikirim dan sedang menunggu persetujuan admin.",
    kelas: "bg-amber-50 text-amber-700 border-amber-200",
  },
  approved: {
    judul: "Kamu sudah menjadi petugas",
    teks: "Pengajuanmu disetujui admin. Silakan masuk ke dashboard petugas.",
    kelas: "bg-blue-50 text-blue-700 border-blue-200",
  },
  rejected: {
    judul: "Pengajuan ditolak",
    teks: "Permintaanmu untuk menjadi petugas ditolak oleh admin. Kamu bisa menghubungi admin untuk info lebih lanjut.",
    kelas: "bg-red-50 text-red-700 border-red-200",
  },
};

export default function JadiPetugasPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    alasan: "",
    pengalaman: "",
    noHpPetugas: "",
  });

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function ajukan(e) {
    e.preventDefault();
    if (!user) return;

    setError("");

    if (!form.alasan.trim() || !form.noHpPetugas.trim()) {
      return setError("Alasan dan nomor HP wajib diisi.");
    }

    setLoading(true);
    const updated = ajukanJadiPetugas(user.id, form);
    setUser(updated);
    setLoading(false);
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

  const status = user.statusPetugas && user.statusPetugas !== "none"
    ? PESAN_STATUS[user.statusPetugas]
    : null;

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">
        ← Beranda
      </Link>

      <h1 className="mt-4 text-3xl font-black text-slate-900">Jadi Petugas</h1>
      <p className="mt-2 text-sm text-slate-500">
        Petugas bertugas mengecek kondisi barang sebelum disewakan dan saat
        dikembalikan. Tidak ada pendaftaran akun terpisah — cukup ajukan diri
        di sini, lalu tunggu persetujuan admin.
      </p>

      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        {status ? (
          <div className={`rounded-xl border p-4 text-sm ${status.kelas}`}>
            <p className="font-semibold">{status.judul}</p>
            <p className="mt-1">{status.teks}</p>
          </div>
        ) : (
          <form onSubmit={ajukan} className="space-y-3">
            <p className="text-sm text-slate-600">
              Isi form di bawah untuk mengirim permintaan menjadi petugas ke
              admin.
            </p>

            <Field
              name="alasan"
              label="Alasan ingin jadi petugas"
              value={form.alasan}
              onChange={handleChange}
              textarea
            />

            <Field
              name="pengalaman"
              label="Pengalaman terkait (opsional)"
              value={form.pengalaman}
              onChange={handleChange}
              textarea
              required={false}
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

        {status && user.statusPetugas === "approved" && (
          <Link
            href="/petugas/dashboard"
            className="mt-4 block rounded-lg bg-blue-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-800"
          >
            Buka Dashboard Petugas
          </Link>
        )}

        {status && user.statusPetugas === "rejected" && (
          <form onSubmit={ajukan} className="mt-4 space-y-3">
            <Field
              name="alasan"
              label="Alasan ingin jadi petugas"
              value={form.alasan}
              onChange={handleChange}
              textarea
            />

            <Field
              name="pengalaman"
              label="Pengalaman terkait (opsional)"
              value={form.pengalaman}
              onChange={handleChange}
              textarea
              required={false}
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
              {loading ? "Mengirim..." : "Ajukan Lagi"}
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
