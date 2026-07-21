import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useApp } from "@/store/app";
import { useState } from "react";
import { toast } from "sonner";
import { LogIn, UserPlus, ShieldCheck } from "lucide-react";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "تسجيل الدخول — صندوق العطاء" }] }),
  component: AuthPage,
});

function AuthPage() {
  const login = useApp((s) => s.login);
  const signup = useApp((s) => s.signup);
  const nav = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [f, setF] = useState({ name: "", email: "", password: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      const r = login(f.email, f.password);
      if (!r.ok) return toast.error(r.msg);
      toast.success("مرحباً بعودتك");
      const isAdmin = f.email === "admin@donate.gov";
      nav({ to: isAdmin ? "/admin" : "/profile" });
    } else {
      if (!f.name || !f.email || f.password.length < 6) return toast.error("عبّئ الحقول (كلمة السر 6 أحرف فأكثر)");
      const r = signup(f);
      if (!r.ok) return toast.error(r.msg);
      toast.success("تم إنشاء الحساب");
      nav({ to: "/profile" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20 min-h-screen">
        <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 gap-10 items-center">
          <Reveal className="hidden lg:block">
            <div className="relative rounded-[2rem] overflow-hidden shadow-elegant border border-gold/30">
              <img src={heroImg} alt="" className="w-full h-[560px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/90 to-transparent" />
              <div className="absolute bottom-8 right-8 left-8 text-primary-foreground">
                <div className="inline-flex items-center gap-2 rounded-full bg-gold/20 border border-gold/40 px-3 py-1 text-xs">
                  <ShieldCheck className="h-3.5 w-3.5 text-gold" /> منصة موثقة حكومياً
                </div>
                <h2 className="mt-4 font-display text-4xl font-bold leading-[1.6]">
                  انضم لآلاف <span className="text-gradient-gold">المتبرعين</span>
                </h2>
                <p className="mt-2 text-white/80">حسابك بوابتك لتقديم طلب مساعدة أو دعم من تحب.</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="rounded-3xl border border-border bg-card p-8 lg:p-10 shadow-elegant">
              <div className="text-center mb-6">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-emerald-deep text-primary-foreground shadow-elegant">
                  {mode === "login" ? <LogIn className="h-6 w-6" /> : <UserPlus className="h-6 w-6" />}
                </div>
                <h1 className="mt-4 font-display text-3xl font-bold">
                  {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
                </h1>
              </div>

              <Tabs value={mode} onValueChange={(v) => setMode(v as "login" | "signup")}>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="login">دخول</TabsTrigger>
                  <TabsTrigger value="signup">حساب جديد</TabsTrigger>
                </TabsList>

                <form onSubmit={submit} className="space-y-4 mt-6">
                  <TabsContent value="signup" className="space-y-4 mt-0">
                    <div>
                      <Label>الاسم الكامل</Label>
                      <Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="مثال: أحمد محمد" />
                    </div>
                  </TabsContent>
                  <div>
                    <Label>البريد الإلكتروني</Label>
                    <Input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="you@example.com" />
                  </div>
                  <div>
                    <Label>كلمة المرور</Label>
                    <Input type="password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} placeholder="••••••••" />
                  </div>
                  <Button type="submit" size="lg" className="w-full h-12 rounded-full bg-gradient-to-l from-gold to-amber-400 text-gold-foreground shadow-gold">
                    {mode === "login" ? "دخول" : "إنشاء الحساب"}
                  </Button>
                </form>
              </Tabs>

              <div className="mt-6 rounded-xl bg-muted p-3 text-xs text-muted-foreground text-center">
                لتجربة الإدارة: <strong>admin@donate.gov</strong> / <strong>admin123</strong>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <Footer />
    </div>
  );
}
