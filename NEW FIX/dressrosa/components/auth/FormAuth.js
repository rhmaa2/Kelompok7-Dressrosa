"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { registerUser, loginUser } from "@/lib/store";

import Button from "@/components/ui/Button";

export default function FormAuth({ mode }) {
  const router = useRouter();
  const register = mode === "register";

  const [form, setForm] = useState({
    nama: "",
    email: "",
    noHp: "",
    alamat: "",
    password: "",
    confirm: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!emailValid) {
      return setError("Format email tidak valid.");
    }

    if (form.password.length < 6) {
      return setError("Password minimal 6 karakter.");
    }

    if (register) {
      if (!form.nama || !form.noHp) {
        return setError("Nama dan nomor HP wajib diisi.");
      }

      if (form.password !== form.confirm) {
        return setError("Konfirmasi password tidak sama.");
      }
    }

    setLoading(true);

    try {
      if (register) {
        await registerUser({
          nama: form.nama,
          email: form.email,
          password: form.password,
          noHp: form.noHp,
        });
        router.push("/barang");
        return;
      }

      const user = await loginUser({ email: form.email, password: form.password });

      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else if (user.role === "petugas") {
        router.push("/petugas/dashboard");
      } else {
        router.push("/barang");
      }
    } catch (err) {
      setError(err.message || "Email atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {register && (
        <>
          <Field
            name="nama"
            label="Nama lengkap"
            value={form.nama}
            onChange={handleChange}
          />

          <Field
            name="noHp"
            label="Nomor HP"
            value={form.noHp}
            onChange={handleChange}
          />
        </>
      )}

      <Field
        name="email"
        label="Email"
        type="email"
        value={form.email}
        onChange={handleChange}
      />

      <Field
        name="password"
        label="Password"
        type="password"
        value={form.password}
        onChange={handleChange}
      />

      {register && (
        <Field
          name="confirm"
          label="Konfirmasi password"
          type="password"
          value={form.confirm}
          onChange={handleChange}
        />
      )}

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      <Button disabled={loading} className="w-full">
        {loading
          ? "Memproses..."
          : register
          ? "Daftar"
          : "Masuk"}
      </Button>
    </form>
  );
}


function Field({
  name,
  label,
  type = "text",
  value,
  onChange,
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-700">
        {label}
      </span>

      <input
        required
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}