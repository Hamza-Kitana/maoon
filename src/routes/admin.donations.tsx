import { createFileRoute } from "@tanstack/react-router";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useApp } from "@/store/app";
import { useCategoriesList } from "@/store/content";
import { HandCoins } from "lucide-react";

export const Route = createFileRoute("/admin/donations")({
  component: AdminDonations,
});

function AdminDonations() {
  const donations = useApp((s) => s.donations);
  const requests = useApp((s) => s.requests);
  const categories = useCategoriesList();
  const total = donations.reduce((a, d) => a + d.amount, 0);

  return (
    <>
      <AdminHeader title="سجل التبرعات" subtitle={`إجمالي: ${total.toLocaleString("ar")} د.أ`} />
      <div className="p-8">
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 text-right">المتبرع</th>
                <th className="p-4 text-right">المبلغ</th>
                <th className="p-4 text-right">الوجهة</th>
                <th className="p-4 text-right">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {donations.length === 0 ? (
                <tr><td colSpan={4} className="p-10 text-center text-muted-foreground">لا توجد تبرعات بعد</td></tr>
              ) : (
                donations.map((d) => {
                  const cat = categories.find((c) => c.slug === d.categorySlug);
                  const req = requests.find((r) => r.id === d.requestId);
                  return (
                    <tr key={d.id} className="border-t border-border hover:bg-muted/30">
                      <td className="p-4">{d.donorName}</td>
                      <td className="p-4">
                        <div className="inline-flex items-center gap-2 font-semibold text-primary">
                          <HandCoins className="h-4 w-4" />
                          {d.amount.toLocaleString("ar")} د.أ
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {req ? `حالة: ${req.title}` : cat ? `عام: ${cat.title}` : "عام"}
                      </td>
                      <td className="p-4 text-muted-foreground text-xs">{new Date(d.createdAt).toLocaleString("ar")}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
