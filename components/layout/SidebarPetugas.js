"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/lib/store";

const LINKS = [
  {
    href: "/petugas/dashboard",
    label: "Dashboard",
    icon: "📊",
  },
  {
    href: "/petugas/barang",
    label: "Kelola Barang",
    icon: "📦",
  },
  {
    href: "/petugas/pengecekan",
    label: "Pengecekan",
    icon: "🔍",
  },
];

export default function SidebarPetugas() {
  const path = usePathname();
  const router = useRouter();

  function keluar() {
    logout();
    router.replace("/login");
  }

  return (
    <aside className="flex w-full flex-col justify-between border-b bg-slate-900 text-white md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div>
        {/* HEADER SIDEBAR */}
        <div className="border-b border-slate-800 p-5">
          <p className="text-xl font-black tracking-wide">
            EVENTRA
          </p>

          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-blue-600/20 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-blue-400"></span>
            <p className="text-xs font-medium text-blue-300">
              Petugas
            </p>
          </div>
        </div>

        {/* MENU */}
        <div className="px-3 py-5">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Menu Utama
          </p>

          <div className="space-y-1">
            {LINKS.map((item) => {
              const aktif = path === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    aktif
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span className="text-base">
                    {item.icon}
                  </span>

                  <span>{item.label}</span>

                  {aktif && (
                    <span className="ml-auto text-xs">
                      →
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* LOGOUT */}
      <div className="border-t border-slate-800 p-3">
        <button
          onClick={keluar}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <span className="text-base">↪</span>
          <span>Keluar</span>
        </button>

        <p className="mt-3 px-3 text-[10px] text-slate-600">
          EVENTRA • Panel Petugas
        </p>
      </div>
    </aside>
  );
}