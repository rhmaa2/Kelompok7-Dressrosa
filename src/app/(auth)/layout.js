export default function Layout({ children }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-5 text-center">
          <h1 className="text-3xl font-black text-blue-600">EVENTRA</h1>
          <p className="text-sm text-slate-500">
            Peminjaman perlengkapan pesta & acara
          </p>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          {children}
        </div>
      </div>
    </main>
  );
}