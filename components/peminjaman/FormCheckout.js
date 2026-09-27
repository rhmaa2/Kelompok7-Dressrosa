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

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setError("");

    if (!user) return setError("Silakan login terlebih dahulu.");
    if (!form.tanggal_mulai_sewa || !form.tanggal_selesai_sewa)
      return setError("Tanggal mulai dan selesai wajib diisi.");
    if (new Date(form.tanggal_selesai_sewa) < new Date(form.tanggal_mulai_sewa))
      return setError("Tanggal selesai tidak boleh sebelum tanggal mulai.");

    setSaving(true);

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

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="rounded-xl bg-slate-50 p-4">
        <p className="font-semibold">Ringkasan</p>

        {cart.map((x) => (
          <div key={x.barangId} className="mt-2 flex justify-between text-sm">
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
          value={form.tanggal_mulai_sewa}
          onChange={change}
        />

        <Field
          name="tanggal_selesai_sewa"
          label="tanggal_selesai_sewa"
          type="date"
          value={form.tanggal_selesai_sewa}
          onChange={change}
        />
      </div>

      <div className="rounded-xl border p-4 text-sm">
        <div className="flex justify-between">
          <span>Durasi</span>
          <b>{hari} hari</b>
        </div>

        <div className="mt-3 border-t pt-3 text-base">
          <div className="flex justify-between">
            <span>Total pengajuan</span>
            <b className="text-blue-600">{formatRupiah(totalSewa)}</b>
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