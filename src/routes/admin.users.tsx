import { createFileRoute } from "@tanstack/react-router";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useApp } from "@/store/app";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Shield } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

function AdminUsers() {
  const users = useApp((s) => s.users);
  const requests = useApp((s) => s.requests);
  const donations = useApp((s) => s.donations);
  const del = useApp((s) => s.deleteUser);
  const me = useApp((s) => s.currentUser());

  return (
    <>
      <AdminHeader title="المستخدمون" subtitle={`${users.length} مستخدم مسجّل`} />
      <div className="p-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {users.map((u) => {
            const reqs = requests.filter((r) => r.userId === u.id).length;
            const dons = donations.filter((d) => d.donorId === u.id).reduce((a, d) => a + d.amount, 0);
            return (
              <div key={u.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-emerald-deep grid place-items-center text-primary-foreground font-bold text-lg shrink-0">
                    {u.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold truncate">{u.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                  </div>
                  {u.role === "admin" && (
                    <Badge className="bg-gold text-gold-foreground gap-1"><Shield className="h-3 w-3" /> مشرف</Badge>
                  )}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-xl bg-muted p-3">
                    <div className="text-xs text-muted-foreground">طلبات</div>
                    <div className="font-bold text-lg">{reqs}</div>
                  </div>
                  <div className="rounded-xl bg-muted p-3">
                    <div className="text-xs text-muted-foreground">تبرع</div>
                    <div className="font-bold text-lg">{dons.toLocaleString("ar")} د.أ</div>
                  </div>
                </div>
                {u.id !== me?.id && u.role !== "admin" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3 text-destructive hover:text-destructive"
                    onClick={() => { if (confirm("حذف المستخدم؟")) { del(u.id); toast.success("تم الحذف"); } }}
                  >
                    <Trash2 className="h-4 w-4" /> حذف الحساب
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
