import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";

export default function RegisterPage() {
  return (
    <>
      <h2 className="mb-1 text-xl font-bold">Daftar Akun</h2>
      <p className="mb-5 text-sm text-slate-500">
        Buat akun penyewa baru.
      </p>
      <AuthForm mode="register" />
      <p className="mt-4 text-center text-sm text-slate-500">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-blue-600">
          Masuk
        </Link>
      </p>
    </>
  );
}