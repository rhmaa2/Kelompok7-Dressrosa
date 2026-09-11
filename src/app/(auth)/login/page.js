import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-slate-800">Masuk</h2>

      <AuthForm mode="login" />

      <p className="mt-4 text-center text-sm text-slate-500">
        Belum punya akun?{" "}
        <Link href="/register" className="font-medium text-emerald-600 hover:underline">
          Daftar di sini
        </Link>
      </p>
    </div>
  );
}
