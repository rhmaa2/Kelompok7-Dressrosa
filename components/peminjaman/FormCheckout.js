"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clearCart } from "@/lib/cart";
import { getCurrentUser, getPengajuan, savePengajuan } from "@/lib/store";
import { daysBetween, formatRupiah } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function FormCheckout({ cart }) {
  const router = useRouter();
  const user = getCurrentUser();

  const [form, setForm] = useState({
    tanggalMulai: "",
    tanggalSelesai: "",
    metode: "ambil",
    alamat: user?.alamat || "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const hari = daysBetween(form.tanggalMulai, form.tanggalSelesai);
  const totalSewa = cart.reduce((s, x) => s + x.hargaSewa * x.qty, 0) * hari;
  const totalJaminan = cart.reduce((s, x) => s + x.jaminan * x.qty, 0);
  const totalBayar = totalSewa + totalJaminan;

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function submit(e) {
    e.preventDefault();
    setError("");

    if (!user) return setError("Silakan login terlebih dahulu.");
    if (!form.tanggalMulai || !form.tanggalSelesai)
      return setError("Tanggal mulai dan selesai wajib diisi.");
    if (new Date(form.tanggalSelesai) < new Date(form.tanggalMulai))
      return setError("Tanggal selesai tidak boleh sebelum tanggal mulai.");
    if (form.metode === "antar" && !form.alamat.trim())
      return setError("Alamat pengantaran wajib diisi.");

    setSaving(true);

    const list = getPengajuan();
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
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="rounded-xl bg-slate-50 p-4">
        <p className="font-semibold">Ringkasan</p>

        {cart.map((x) => (
          <div key={x.barangId} className="mt-2 flex justify-between text-sm">
            <span>
              {x.nama} × {x.qty}
            </span>
            <span>{formatRupiah(x.hargaSewa * x.qty)}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="tanggalMulai"
          label="Tanggal mulai"
          type="date"
          value={form.tanggalMulai}
          onChange={change}
        />

        <Field
          name="tanggalSelesai"
          label="Tanggal selesai"
          type="date"
          value={form.tanggalSelesai}
          onChange={change}
        />
      </div>

      <label className="block text-sm">
        <span className="mb-1 block font-medium">Metode pengambilan</span>
        <select
          name="metode"
          value={form.metode}
          onChange={change}
          className="w-full rounded-lg border px-3 py-2"
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
          onChange={change}
        />
      )}

      <div className="rounded-xl border p-4 text-sm">
        <div className="flex justify-between">
          <span>Durasi</span>
          <b>{hari} hari</b>
        </div>

        <div className="mt-2 flex justify-between">
          <span>Total sewa</span>
          <b>{formatRupiah(totalSewa)}</b>
        </div>

        <div className="mt-2 flex justify-between">
          <span>Jaminan</span>
          <b>{formatRupiah(totalJaminan)}</b>
        </div>

        <div className="mt-3 border-t pt-3 text-base">
          <div className="flex justify-between">
            <span>Total pengajuan</span>
            <b className="text-blue-600">{formatRupiah(totalBayar)}</b>
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
      <span className="mb-1 block font-medium">{label}</span>
      <input
        required
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border px-3 py-2"
      />
    </label>
  );
}

