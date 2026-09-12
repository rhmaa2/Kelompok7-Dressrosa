import SidebarAdmin from "@/components/layout/SidebarAdmin";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 md:flex-row">
      <SidebarAdmin />
      <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}