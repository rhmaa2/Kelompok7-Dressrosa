"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clearCart } from "@/lib/cart";
import { getCurrentUser, buatPeminjaman } from "@/lib/store";
import { daysBetween, formatRupiah } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function FormCheckout({ cart }) {
  const router = useRouter();
  const user = getCurrentUser();

  const [form, setForm] = useState({
    tanggal_mulai_sewa: "",
    tanggal_selesai_sewa: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const hari = daysBetween(form.tanggal_mulai_sewa, form.tanggal_selesai_sewa);
  const hargaItem = (x) => Number(x.hargaSewa ?? x.harga_sewa_per_hari ?? x.harga_sewa ?? 0);
  const totalSewa = cart.reduce((s, x) => s + hargaItem(x) * Number(x.qty || 0), 0) * Math.max(hari, 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

<<<<<<< HEAD
  const handleSubmit = (e) => {
=======
  async function submit(e) {
>>>>>>> b5af262921bebe0badafcfb6b31722e352043fdd
    e.preventDefault();
    setError("");

    if (!user) return setError("Silakan login terlebih dahulu.");
    if (!form.tanggal_mulai_sewa || !form.tanggal_selesai_sewa)
      return setError("Tanggal mulai dan selesai wajib diisi.");
    if (new Date(form.tanggal_selesai_sewa) < new Date(form.tanggal_mulai_sewa))
      return setError("Tanggal selesai tidak boleh sebelum tanggal mulai.");

    setSaving(true);

<<<<<<< HEAD
    const list = getPengajuan() || [];
    const p = {
      id: Date.now(),
      userId: user.id,
      userNama: user.nama,
      ...form,
      totalSewa,
      totalJaminan,
      totalBayar,
      sudahBayar: false,
      status: "PENDING",
      items: cart.map((x) => ({ ...x })),
      kondisiAwal: "",
      kondisiAkhir: "",
    };

    savePengajuan([p, ...list]);
    clearCart();
    router.push(`/status/${p.id}`);
  };
=======
    try {
      const p = await buatPeminjaman({
        userId: user.id,
        userNama: user.nama,
        tanggalMulai: form.tanggal_mulai_sewa,
        tanggalSelesai: form.tanggal_selesai_sewa,
        totalBayar: totalSewa,
        items: cart,
      });

      clearCart();
      router.push(`/status/${p.id}`);
    } catch (err) {
      setError(err.message || "Gagal mengirim pengajuan. Coba lagi.");
      setSaving(false);
    }
  }
>>>>>>> b5af262921bebe0badafcfb6b31722e352043fdd

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-xl bg-slate-50 p-4">
        <p className="font-semibold text-slate-900">Ringkasan</p>

        {cart.map((x) => (
          <div key={x.barangId} className="mt-2 flex justify-between text-sm text-slate-700">
            <span>
              {x.nama} × {x.qty}
            </span>
            <span>{formatRupiah(hargaItem(x) * Number(x.qty || 0))}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="tanggal_mulai_sewa"
          label="tanggal_mulai_sewa"
          type="date"
<<<<<<< HEAD
          value={form.tanggalMulai}
          onChange={handleChange}
=======
          value={form.tanggal_mulai_sewa}
          onChange={change}
>>>>>>> b5af262921bebe0badafcfb6b31722e352043fdd
        />

        <Field
          name="tanggal_selesai_sewa"
          label="tanggal_selesai_sewa"
          type="date"
<<<<<<< HEAD
          value={form.tanggalSelesai}
          onChange={handleChange}
        />
      </div>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Metode pengambilan</span>
        <select
          name="metode"
          value={form.metode}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
        >
          <option value="ambil">Ambil sendiri</option>
          <option value="antar">Diantar</option>
        </select>
      </label>

      {form.metode === "antar" && (
        <Field
          name="alamat"
          label="Alamat pengantaran"
          value={form.alamat}
          onChange={handleChange}
        />
      )}

      <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-700">
=======
          value={form.tanggal_selesai_sewa}
          onChange={change}
        />
      </div>

      <div className="rounded-xl border p-4 text-sm">
>>>>>>> b5af262921bebe0badafcfb6b31722e352043fdd
        <div className="flex justify-between">
          <span>Durasi</span>
          <b className="text-slate-900">{hari} hari</b>
        </div>

<<<<<<< HEAD
        <div className="mt-2 flex justify-between">
          <span>Total sewa</span>
          <b className="text-slate-900">{formatRupiah(totalSewa)}</b>
        </div>

        <div className="mt-2 flex justify-between">
          <span>Jaminan</span>
          <b className="text-slate-900">{formatRupiah(totalJaminan)}</b>
        </div>

        <div className="mt-3 border-t border-slate-200 pt-3 text-base">
          <div className="flex justify-between">
            <span className="font-semibold text-slate-900">Total pengajuan</span>
            <b className="text-blue-600">{formatRupiah(totalBayar)}</b>
=======
        <div className="mt-3 border-t pt-3 text-base">
          <div className="flex justify-between">
            <span>Total pengajuan</span>
            <b className="text-blue-600">{formatRupiah(totalSewa)}</b>
>>>>>>> b5af262921bebe0badafcfb6b31722e352043fdd
          </div>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      <Button disabled={saving} className="w-full">
        {saving ? "Mengirim..." : "Kirim Pengajuan"}
      </Button>
    </form>
  );
}

function Field({ name, label, type = "text", value, onChange }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-700">{label}</span>
      <input
        required
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
      />
    </label>
  );
}