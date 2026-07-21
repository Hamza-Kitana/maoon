import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SectionCard } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/store/app";
import { toast } from "sonner";
import { Save, Eye, EyeOff, UserCog, KeyRound } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const user = useApp((s) => s.currentUser());
  const updateUser = useApp((s) => s.updateUser);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);

  if (!user) return null;

  const saveAccount = () => {
    if (!name.trim()) return toast.error("أدخل الاسم");
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("أدخل بريداً إلكترونياً صحيحاً");
    const res = updateUser(user.id, { name: name.trim(), email: email.trim() });
    if (!res.ok) return toast.error(res.msg ?? "تعذر الحفظ");
    toast.success("تم تحديث بيانات الحساب");
  };

  const savePassword = () => {
    if (currentPw !== user.password) return toast.error("كلمة المرور الحالية غير صحيحة");
    if (newPw.length < 6) return toast.error("كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل");
    if (newPw !== confirmPw) return toast.error("تأكيد كلمة المرور غير مطابق");
    updateUser(user.id, { password: newPw });
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    toast.success("تم تغيير كلمة المرور بنجاح");
  };

  return (
    <>
      <AdminHeader title="الإعدادات" subtitle="إدارة بيانات حساب المشرف" />
      <div className="p-8 max-w-2xl space-y-6">
        <SectionCard title="بيانات الحساب" desc="الاسم والبريد الإلكتروني المستخدم لتسجيل الدخول">
          <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/30 p-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary to-emerald-deep text-primary-foreground shadow-elegant">
              <UserCog className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold">{user.name}</div>
              <div className="text-xs text-muted-foreground">مشرف عام — {user.email}</div>
            </div>
          </div>
          <div>
            <Label htmlFor="admin-name">الاسم</Label>
            <Input id="admin-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="admin-email">البريد الإلكتروني</Label>
            <Input id="admin-email" type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="flex justify-end">
            <Button onClick={saveAccount} className="bg-gradient-to-l from-gold to-amber-400 text-gold-foreground shadow-gold">
              <Save className="h-4 w-4" /> حفظ البيانات
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="تغيير كلمة المرور" desc="أدخل كلمة المرور الحالية ثم الجديدة">
          <div>
            <Label htmlFor="pw-current">كلمة المرور الحالية</Label>
            <div className="relative">
              <Input
                id="pw-current"
                type={showPw ? "text" : "password"}
                dir="ltr"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPw ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="pw-new">كلمة المرور الجديدة</Label>
              <Input
                id="pw-new"
                type={showPw ? "text" : "password"}
                dir="ltr"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="pw-confirm">تأكيد كلمة المرور الجديدة</Label>
              <Input
                id="pw-confirm"
                type={showPw ? "text" : "password"}
                dir="ltr"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={savePassword} className="bg-gradient-to-l from-gold to-amber-400 text-gold-foreground shadow-gold">
              <KeyRound className="h-4 w-4" /> تغيير كلمة المرور
            </Button>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
