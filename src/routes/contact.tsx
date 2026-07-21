import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useContent } from "@/store/content";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تواصل معنا — معوان الخير" },
      { name: "description", content: "تواصل مع فريق معوان الخير." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const c = useContent((s) => s.content.contact);
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.msg) return toast.error("الرجاء تعبئة كافة الحقول");
    toast.success("شكراً لتواصلك — سنعود إليك قريباً");
    setForm({ name: "", email: "", msg: "" });
  };
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-40 pb-24">
        <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 gap-12">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-primary">
              تواصل معنا
            </div>
            <h1 className="mt-4 font-display text-5xl md:text-6xl font-bold">
              {c.title} <span className="text-gradient-gold">{c.titleHighlight}</span>
            </h1>
            <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
              {c.desc}
            </p>
            <div className="mt-10 space-y-5">
              {[
                { icon: Phone, label: "الخط الساخن", value: c.phone },
                { icon: Mail, label: "البريد الإلكتروني", value: c.email },
                { icon: MapPin, label: "المقر الرئيسي", value: c.address },
              ].map((i) => (
                <div key={i.label} className="flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-emerald-deep text-primary-foreground shadow-elegant shrink-0">
                    <i.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">{i.label}</div>
                    <div className="font-semibold">{i.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <form onSubmit={submit} className="rounded-3xl border border-border bg-card p-8 shadow-elegant space-y-5">
              <div>
                <Label>الاسم الكامل</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="اسمك الكريم" />
              </div>
              <div>
                <Label>البريد الإلكتروني</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
              </div>
              <div>
                <Label>رسالتك</Label>
                <Textarea rows={5} value={form.msg} onChange={(e) => setForm({ ...form, msg: e.target.value })} placeholder="اكتب رسالتك هنا..." />
              </div>
              <Button type="submit" size="lg" className="w-full h-12 rounded-full bg-gradient-to-l from-gold to-amber-400 text-gold-foreground shadow-gold">
                <Send className="h-4 w-4" /> إرسال الرسالة
              </Button>
            </form>
          </Reveal>
        </div>
      </section>
      <Footer />
    </div>
  );
}
