import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <>
      <h2 className="mb-1 text-xl font-bold">Masuk</h2>
      <p className="mb-5 text-sm text-slate-500">
        Gunakan akun kamu untuk melanjutkan.
      </p>
      <AuthForm mode="login" />
      <p className="mt-4 text-center text-sm text-slate-500">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-blue-600">
          Daftar
        </Link>
      </p>
    </>
    
  );
}