"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/lib/store";

const LINKS = [
  ["/admin/dashboard", "Dashboard", "📊"],
  ["/admin/barang", "Barang", "📦"],
  ["/admin/pengajuan", "Pengajuan", "📝"],
  ["/admin/pembayaran", "Pembayaran", "💳"],
  ["/admin/user", "User & Petugas", "👥"],
];

export default function SideAdmin() {
  const path = usePathname();
  const router = useRouter();

  function keluar() {
    logout();
    router.replace("/login");
  }

  return (
    <aside className="flex w-full flex-col justify-between border-b border-white/5 bg-gradient-to-b from-[#12142a] to-[#1b1d3a] text-white md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div>
        <div className="p-6">
          <p className="text-xl font-black tracking-tight">
            EVENTRA
          </p>
          <p className="text-xs font-medium text-indigo-300/70">Admin Panel</p>
        </div>

        <div className="space-y-1 px-3 pb-4">
          {LINKS.map(([href, label, icon]) => {
            const active = path === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-900/40"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{icon}</span>
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="border-t border-white/10 p-3">
        <button
          onClick={keluar}
          className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
        >
          ↩ Keluar
        </button>
      </div>
    </aside>
  );
}