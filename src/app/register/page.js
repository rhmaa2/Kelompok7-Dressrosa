import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register, isEmailValid, isPhoneValid } from "@/library/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nama: "",
    email: "",
    noHp: "",
    alamat: "",
    password: "",
    konfirmasiPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const newErrors = {};

    if (form.nama.trim().length < 3) newErrors.nama = "Nama minimal 3 karakter";

    if (!form.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!isEmailValid(form.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!isPhoneValid(form.noHp)) newErrors.noHp = "No. HP harus 10-15 digit angka";
    if (form.alamat.trim().length < 5) newErrors.alamat = "Alamat minimal 5 karakter";

    if (!form.password) {
      newErrors.password = "Password wajib diisi";
    } else if (form.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    if (form.konfirmasiPassword !== form.password) {
      newErrors.konfirmasiPassword = "Konfirmasi password tidak sama";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    // TODO: ganti dengan pemanggilan API asli (belum ada backend)
    setTimeout(() => {
      register({
        nama: form.nama,
        email: form.email,
        noHp: form.noHp,
        alamat: form.alamat,
      });
      setLoading(false);
      router.push("/login");
    }, 800);
  }

  const fields = [
    { name: "nama", label: "Nama Lengkap", type: "text", placeholder: "Nama kamu" },
    { name: "email", label: "Email", type: "email", placeholder: "nama@email.com" },
    { name: "noHp", label: "No. HP", type: "text", placeholder: "081234567890" },
    { name: "alamat", label: "Alamat", type: "text", placeholder: "Alamat lengkap" },
    { name: "password", label: "Password", type: "password", placeholder: "Minimal 6 karakter" },
    { name: "konfirmasiPassword", label: "Konfirmasi Password", type: "password", placeholder: "Ulangi password" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-800">Eventra</h1>
          <p className="text-sm text-slate-500">Peminjaman perlengkapan pesta & acara</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Daftar Akun</h2>

          <form onSubmit={handleSubmit} noValidate>
            {fields.map((field) => (
              <div className="mb-4" key={field.name}>
                <label className="mb-1 block text-sm font-medium text-slate-700">{field.label}</label>
                <input
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.name]}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors[field.name] ? "border-red-400" : "border-slate-300"
                  }`}
                />
                {errors[field.name] && (
                  <p className="mt-1 text-xs text-red-500">{errors[field.name]}</p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-500">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-medium text-emerald-600 hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
