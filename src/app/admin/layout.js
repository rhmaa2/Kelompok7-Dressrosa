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
    <div className="flex min-h-screen flex-col bg-[radial-gradient(1000px_500px_at_-10%_-10%,rgba(99,102,241,0.08),transparent_55%),radial-gradient(900px_500px_at_110%_0%,rgba(217,70,239,0.08),transparent_55%),#f5f6fb] md:flex-row">
      <SidebarAdmin />
      <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}