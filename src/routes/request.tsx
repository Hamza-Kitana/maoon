import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { useApp } from "@/store/app";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategoriesList } from "@/store/content";
import { toast } from "sonner";
import { FileText } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/request")({
  head: () => ({ meta: [{ title: "طلب مساعدة — معوان الخير" }] }),
  component: RequestPage,
});

function RequestPage() {
  const user = useApp((s) => s.currentUser());
  const create = useApp((s) => s.createRequest);
  const categories = useCategoriesList();
  const nav = useNavigate();
  const [f, setF] = useState({
    categorySlug: categories[0]?.slug ?? "",
    title: "",
    description: "",
    amountNeeded: 500,
    anonymous: false,
  });

  useEffect(() => {
    if (!user) nav({ to: "/auth" });
  }, [user, nav]);

  if (!user) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.title || !f.description || f.amountNeeded <= 0) return toast.error("الرجاء تعبئة كافة الحقول");
    create(f);
    toast.success("تم إرسال طلبك — سيراجعه المشرف قريباً");
    nav({ to: "/profile" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <div className="text-center mb-10">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-emerald-deep text-primary-foreground shadow-elegant">
                <FileText className="h-7 w-7" />
              </div>
              <h1 className="mt-6 font-display text-4xl md:text-5xl font-bold">تقديم طلب مساعدة</h1>
              <p className="mt-3 text-muted-foreground">اشرح حالتك بصدق ووضوح. جميع الطلبات تخضع لمراجعة اللجنة المختصة.</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={submit} className="rounded-3xl border border-border bg-card p-8 shadow-elegant space-y-5">
              <div>
                <Label>القسم المناسب لحالتك</Label>
                <Select value={f.categorySlug} onValueChange={(v) => setF({ ...f, categorySlug: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>{c.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>عنوان مختصر للطلب</Label>
                <Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="مثال: مساعدة في سداد أقساط الجامعة" />
              </div>
              <div>
                <Label>وصف الحالة</Label>
                <Textarea rows={6} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} placeholder="اشرح ظروفك بالتفصيل..." />
              </div>
              <div>
                <Label>المبلغ المطلوب (د.أ)</Label>
                <Input type="number" min={1} value={f.amountNeeded} onChange={(e) => setF({ ...f, amountNeeded: Number(e.target.value) })} />
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={f.anonymous} onChange={(e) => setF({ ...f, anonymous: e.target.checked })} className="h-4 w-4 accent-primary" />
                إخفاء اسمي عن العامة (يبقى ظاهراً للإدارة فقط)
              </label>
              <Button type="submit" size="lg" className="w-full h-12 rounded-full bg-gradient-to-l from-gold to-amber-400 text-gold-foreground shadow-gold">
                إرسال الطلب
              </Button>
            </form>
          </Reveal>
        </div>
      </section>
      <Footer />
    </div>
  );
}
