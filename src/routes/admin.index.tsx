import { createFileRoute } from "@tanstack/react-router";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useApp } from "@/store/app";
import { useCategoriesList } from "@/store/content";
import { Users, FileText, HandCoins, Clock, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const users = useApp((s) => s.users);
  const requests = useApp((s) => s.requests);
  const donations = useApp((s) => s.donations);
  const categories = useCategoriesList();

  const total = donations.reduce((a, d) => a + d.amount, 0);
  const pending = requests.filter((r) => r.status === "pending").length;
  const approved = requests.filter((r) => r.status === "approved").length;
  const rejected = requests.filter((r) => r.status === "rejected").length;

  const stats = [
    { label: "إجمالي المستخدمين", value: users.length, icon: Users, tone: "bg-emerald-600" },
    { label: "طلبات نشطة", value: requests.length, icon: FileText, tone: "bg-amber-500" },
    { label: "إجمالي التبرعات", value: `${total.toLocaleString("ar")} د.أ`, icon: HandCoins, tone: "bg-gold" },
    { label: "قيد المراجعة", value: pending, icon: Clock, tone: "bg-blue-600" },
  ];

  const byCategory = categories.map((c) => ({
    ...c,
    count: requests.filter((r) => r.categorySlug === c.slug).length,
    raised: donations.filter((d) => d.categorySlug === c.slug).reduce((a, d) => a + d.amount, 0),
  }));

  return (
    <>
      <AdminHeader title="لوحة التحكم" subtitle="نظرة عامة على أداء المنصة" />
      <div className="p-8 space-y-8">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-card border border-border p-6 shadow-sm hover:shadow-elegant transition-shadow"
            >
              <div className={`grid h-12 w-12 place-items-center rounded-xl ${s.tone} text-white shadow-sm`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 text-sm text-muted-foreground">{s.label}</div>
              <div className="font-display text-3xl font-bold mt-1">{typeof s.value === "number" ? s.value.toLocaleString("ar") : s.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-6">
            <h3 className="font-display text-xl font-bold mb-5">التبرعات حسب القسم</h3>
            <div className="space-y-3">
              {byCategory.slice(0, 8).map((c) => {
                const max = Math.max(...byCategory.map((x) => x.raised), 1);
                const pct = (c.raised / max) * 100;
                return (
                  <div key={c.slug}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <c.icon className="h-4 w-4 text-primary shrink-0" />
                        <span className="truncate">{c.title}</span>
                      </div>
                      <span className="font-semibold text-primary shrink-0">{c.raised.toLocaleString("ar")} د.أ</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-l from-gold to-amber-400"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border p-6">
            <h3 className="font-display text-xl font-bold mb-5">حالة الطلبات</h3>
            <div className="space-y-4">
              <StatRow icon={Clock} label="قيد المراجعة" value={pending} color="text-amber-600 bg-amber-50" />
              <StatRow icon={CheckCircle2} label="معتمدة" value={approved} color="text-emerald-700 bg-emerald-50" />
              <StatRow icon={XCircle} label="مرفوضة" value={rejected} color="text-destructive bg-red-50" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StatRow({ icon: Icon, label, value, color }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className={`grid h-11 w-11 place-items-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-display text-2xl font-bold">{value.toLocaleString("ar")}</div>
      </div>
    </div>
  );
}
