import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/store/app";
import { useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "لوحة الإدارة" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const user = useApp((s) => s.currentUser());
  const nav = useNavigate();

  useEffect(() => {
    if (!user) nav({ to: "/auth" });
    else if (user.role !== "admin") nav({ to: "/" });
  }, [user, nav]);

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-muted/30 flex" dir="rtl">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
