"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SidebarAdmin from "@/components/layout/SidebarAdmin";
import { getCurrentUser } from "@/lib/store";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const current = getCurrentUser();
    if (!current || current.role !== "admin") {
      router.replace("/login");
      return;
    }
    setUser(current);
  }, [router]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 md:flex-row">
      <SidebarAdmin />
      <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}