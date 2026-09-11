import SidebarAdmin from "@/components/layout/SidebarAdmin";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <SidebarAdmin />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
