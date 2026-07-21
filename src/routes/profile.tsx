import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { useApp } from "@/store/app";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useCategoriesList } from "@/store/content";
import { FileText, HandCoins, CheckCircle2, Clock, XCircle, Plus } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "حسابي — معوان الخير" }] }),
  component: Profile,
});

function Profile() {
  const user = useApp((s) => s.currentUser());
  const allRequests = useApp((s) => s.requests);
  const allDonations = useApp((s) => s.donations);
  // Filtering must happen outside the selector: doing it inside returns a new
  // array reference on every render and triggers an infinite update loop.
  const requests = useMemo(
    () => allRequests.filter((r) => r.userId === user?.id),
    [allRequests, user?.id],
  );
  const donations = useMemo(
    () => allDonations.filter((d) => d.donorId === user?.id),
    [allDonations, user?.id],
  );
  const categories = useCategoriesList();
  const nav = useNavigate();

  useEffect(() => {
    if (!user) nav({ to: "/auth" });
  }, [user, nav]);

  if (!user) return null;

  const totalDonated = donations.reduce((a, d) => a + d.amount, 0);
  const approved = requests.filter((r) => r.status === "approved").length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-12 bg-gradient-to-b from-emerald-deep to-emerald-deep/90 text-primary-foreground">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-gold grid place-items-center text-2xl font-bold text-gold-foreground shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-gold tracking-widest">مرحباً بك</div>
              <h1 className="mt-1 font-display text-3xl md:text-4xl font-bold">{user.name}</h1>
              <div className="text-sm text-white/70">{user.email}</div>
            </div>
            <Button asChild size="lg" className="rounded-full bg-gold text-gold-foreground shadow-gold">
              <Link to="/request"><Plus className="h-4 w-4" /> طلب مساعدة جديد</Link>
            </Button>
          </div>
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {[
              { label: "إجمالي تبرعاتي", value: `${totalDonated.toLocaleString("ar")} د.أ`, icon: HandCoins },
              { label: "طلباتي", value: requests.length, icon: FileText },
              { label: "طلبات معتمدة", value: approved, icon: CheckCircle2 },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md p-5 flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gold text-gold-foreground shrink-0">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-white/70">{s.label}</div>
                  <div className="font-display text-2xl text-gold">{s.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">طلبات المساعدة</h2>
            {requests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gold/40 bg-gradient-to-br from-primary/5 via-gold/5 to-primary/10 p-10 text-center text-muted-foreground">
                لم تقدم طلبات بعد. <Link to="/request" className="text-primary underline">قدم طلبك الآن</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((r) => {
                  const cat = categories.find((c) => c.slug === r.categorySlug);
                  return (
                    <div key={r.id} className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-bl from-primary/[0.07] via-card to-gold/10 p-5 shadow-sm transition-all hover:border-gold/50 hover:shadow-elegant">
                      <div className="absolute inset-y-3 right-0 w-1 rounded-full bg-gradient-to-b from-gold to-amber-400 opacity-70" />
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{r.title}</div>
                          <div className="text-xs text-muted-foreground">{cat?.title}</div>
                        </div>
                        <StatusBadge status={r.status} />
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{r.description}</p>
                      {r.status === "approved" && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">جُمع</span>
                            <span className="font-semibold text-primary">{r.amountRaised.toLocaleString("ar")} / {r.amountNeeded.toLocaleString("ar")}</span>
                          </div>
                          <Progress value={(r.amountRaised / r.amountNeeded) * 100} />
                        </div>
                      )}
                      {r.adminNote && (
                        <div className="mt-3 rounded-lg bg-muted p-3 text-xs">
                          <strong>ملاحظة الإدارة:</strong> {r.adminNote}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold mb-4">سجل تبرعاتي</h2>
            {donations.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gold/40 bg-gradient-to-br from-primary/5 via-gold/5 to-primary/10 p-10 text-center text-muted-foreground">
                لم تقم بأي تبرع بعد.
              </div>
            ) : (
              <div className="space-y-3">
                {donations.map((d) => (
                  <div key={d.id} className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-bl from-primary/[0.07] via-card to-gold/10 p-5 flex items-center gap-4 shadow-sm transition-all hover:border-gold/50 hover:shadow-elegant">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-gold to-amber-400 text-gold-foreground shrink-0">
                      <HandCoins className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold">{d.amount.toLocaleString("ar")} د.أ</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {d.categorySlug ? `تبرع عام — ${categories.find((c) => c.slug === d.categorySlug)?.title ?? ""}` : "دعم حالة محددة"}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">{new Date(d.createdAt).toLocaleDateString("ar")}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "approved")
    return <Badge className="bg-emerald-600/15 text-emerald-700 border-emerald-600/30 gap-1"><CheckCircle2 className="h-3 w-3" /> معتمد</Badge>;
  if (status === "rejected")
    return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> مرفوض</Badge>;
  return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> قيد المراجعة</Badge>;
}
