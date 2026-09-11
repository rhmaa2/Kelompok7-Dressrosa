import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";

export default function RegisterPage() {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-slate-800">Daftar Akun</h2>

      <AuthForm mode="register" />

      <p className="mt-4 text-center text-sm text-slate-500">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-medium text-emerald-600 hover:underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
