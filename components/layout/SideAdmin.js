"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/lib/store";

const LINKS = [
  ["/admin/dashboard", "Dashboard"],
  ["/admin/pengajuan", "Pengajuan"],
  ["/admin/pembayaran", "Pembayaran"],
  ["/admin/user", "User & Petugas"],
];

export default function SideAdmin() {
  const path = usePathname();
  const router = useRouter();

  function keluar() {
    logout();
    router.replace("/login");
  }

  return (
    <aside className="flex w-full flex-col justify-between border-b bg-slate-900 text-white md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div>
        <div className="p-5">
          <p className="text-xl font-black">EVENTRA</p>
          <p className="text-xs text-slate-400">Admin</p>
        </div>

        <div className="space-y-1 px-3 pb-4">
          {LINKS.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={`block rounded-lg px-3 py-2 text-sm ${
                path === href ? "bg-blue-700" : "hover:bg-slate-800"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-800 p-3">
        <button
          onClick={keluar}
          className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          Keluar
        </button>
      </div>
    </aside>
  );
}