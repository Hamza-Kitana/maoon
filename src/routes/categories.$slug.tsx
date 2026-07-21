import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/site/Reveal";
import { DonateDialog } from "@/components/site/DonateDialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getCategory } from "@/lib/categories";
import { useApp } from "@/store/app";
import { useCategoriesList, useCategoryBySlug } from "@/store/content";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle2, ListChecks, Quote, User, Users } from "lucide-react";

const STEP_LABELS = ["تقديم الطلب", "التحقق والتدقيق", "الاعتماد والعرض", "الوصول والإغلاق"];

export const Route = createFileRoute("/categories/$slug")({
  // Admin-added categories live in the client store, so the loader must not
  // reject unknown slugs; it only supplies head meta for the built-in ones.
  loader: ({ params }) => {
    const cat = getCategory(params.slug);
    return cat ? { title: cat.title, desc: cat.desc } : null;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — معوان الخير` },
          { name: "description", content: loaderData.desc },
        ]
      : [{ title: "قسم — معوان الخير" }],
  }),
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const cat = useCategoryBySlug(slug);
  const categories = useCategoriesList();
  const allRequests = useApp((s) => s.requests);
  const requests = useMemo(
    () => allRequests.filter((r) => r.categorySlug === slug && r.status === "approved"),
    [allRequests, slug],
  );
  const [open, setOpen] = useState(false);
  const [targetReqId, setTargetReqId] = useState<string | undefined>(undefined);
  // Admin-added categories only exist in the browser store, so during SSR /
  // first paint we don't yet know whether the slug is real. Only show the
  // "not found" message after the client has hydrated.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (!cat) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-48 pb-32 text-center px-6">
          {hydrated ? (
            <>
              <h1 className="font-display text-4xl font-bold">القسم غير موجود</h1>
              <p className="mt-3 text-muted-foreground">ربما تم حذف هذا القسم أو تغيير رابطه.</p>
              <Button asChild className="mt-8 rounded-full bg-gradient-to-l from-gold to-amber-400 text-gold-foreground shadow-gold">
                <Link to="/categories">تصفح كل الأقسام</Link>
              </Button>
            </>
          ) : (
            <p className="text-muted-foreground">جارٍ التحميل...</p>
          )}
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = cat.icon;
  const others = categories.filter((c) => c.slug !== cat.slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero with category image */}
      <section className="relative min-h-[45vh] flex items-end overflow-hidden bg-emerald-deep text-primary-foreground">
        <img src={cat.image} alt={cat.title} decoding="async" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep via-emerald-deep/70 to-emerald-deep/30" />
        <div className={`absolute inset-0 bg-gradient-to-l ${cat.color} opacity-60`} />

        <div className="relative mx-auto w-full max-w-7xl px-6 pb-10 pt-36">
          <Reveal>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Link to="/categories" className="text-white/70 hover:text-gold transition-colors">
                الأقسام المدعومة
              </Link>
              <span className="text-white/40">/</span>
              <span className="text-gold font-semibold">{cat.title}</span>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-5">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gold text-gold-foreground shadow-gold shrink-0">
                <Icon className="h-8 w-8" />
              </div>
              <div className="min-w-0">
                <h1 className="font-display text-3xl md:text-5xl font-bold">{cat.title}</h1>
                <p className="mt-1 text-lg text-gold font-semibold">{cat.short}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  setTargetReqId(undefined);
                  setOpen(true);
                }}
                size="lg"
                className="h-13 rounded-full bg-gradient-to-l from-gold to-amber-400 text-gold-foreground shadow-gold hover:opacity-90"
              >
                تبرع لهذا القسم
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-13 rounded-full bg-white/5 border-white/40 text-white hover:bg-white/15 hover:text-white hover:border-gold/60"
              >
                <Link to="/categories">
                  <ArrowRight className="h-4 w-4" /> كل الأقسام
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Full explanation */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-sm font-semibold text-primary">
              عن هذا القسم
            </div>
            <h2 className="mt-5 font-display text-4xl md:text-5xl font-bold leading-[1.5]">قصة هذا القسم ولماذا يستحق دعمك</h2>
            <div className="hairline-gold w-32 mt-7" />
            <p className="mt-7 text-xl leading-loose text-muted-foreground">{cat.longDesc}</p>

            <div className="mt-10 flex items-start gap-5 rounded-3xl border border-gold/30 bg-gold/5 p-8">
              <Quote className="h-10 w-10 text-gold shrink-0" />
              <p className="font-display text-2xl font-bold leading-relaxed text-foreground">{cat.impact}</p>
            </div>
          </Reveal>

          <Reveal className="lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-3xl border border-border shadow-elegant">
              <img src={cat.image} alt={cat.title} loading="lazy" decoding="async" className="h-80 w-full object-cover" />
              <div className="bg-card p-8">
                <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Users className="h-6 w-6 text-primary" />
                  من نساعد في هذا القسم؟
                </div>
                <ul className="mt-5 space-y-4">
                  {cat.whoWeHelp.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-muted-foreground">
                      <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 lg:py-28 bg-emerald-deep text-primary-foreground relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 right-1/4 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6">
          <Reveal className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-4 py-1.5 text-sm font-semibold text-gold">
              <ListChecks className="h-4 w-4" />
              آلية العمل
            </div>
            <h2 className="mt-5 font-display text-4xl md:text-5xl font-bold leading-[1.5]">كيف يصل تبرعك إلى مستحقيه؟</h2>
            <p className="mt-4 text-lg text-white/75">أربع خطوات واضحة تضمن الشفافية الكاملة من لحظة الطلب حتى إغلاق الملف.</p>
          </Reveal>

          <StaggerContainer className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cat.howItWorks.map((step, i) => (
              <StaggerItem key={step} className="h-full">
                <div className="group relative h-full overflow-hidden rounded-3xl border border-white/15 bg-white/5 backdrop-blur p-7 transition-all duration-300 hover:bg-white/10 hover:border-gold/50 hover:-translate-y-1.5">
                  {/* Ghost number in the corner */}
                  <div className="pointer-events-none absolute -top-3 left-3 font-display text-7xl font-bold text-white/[0.07] transition-colors duration-300 group-hover:text-gold/15">
                    {(i + 1).toLocaleString("ar")}
                  </div>

                  <div className="relative flex items-center gap-3">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-l from-gold to-amber-400 text-gold-foreground font-display text-xl font-bold shadow-gold ring-4 ring-gold/20 transition-transform duration-300 group-hover:scale-110">
                      {(i + 1).toLocaleString("ar")}
                    </div>
                    <div className="text-sm font-semibold tracking-wide text-gold">
                      {STEP_LABELS[i] ?? `الخطوة ${(i + 1).toLocaleString("ar")}`}
                    </div>
                  </div>

                  <div className="hairline-gold mt-5 opacity-50" />
                  <p className="relative mt-5 text-base leading-relaxed text-white/90">{step}</p>

                  {/* Connector arrow towards the next step (desktop only) */}
                  {i < cat.howItWorks.length - 1 && (
                    <ArrowLeft className="pointer-events-none absolute bottom-6 left-5 hidden lg:block h-5 w-5 text-gold/40 transition-all duration-300 group-hover:text-gold group-hover:-translate-x-1" />
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Active cases */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-[1.5]">حالات بحاجة إلى دعمك</h2>
            <p className="text-lg text-muted-foreground mt-2">اختر حالة بعينها لتخصيص تبرعك.</p>
            <div className="hairline-gold w-32 mt-6" />
          </Reveal>

          {requests.length === 0 ? (
            <Reveal>
              <div className="mt-10 rounded-3xl border border-dashed border-border bg-card p-16 text-center">
                <p className="text-muted-foreground">
                  لا توجد حالات معتمدة حالياً في هذا القسم. تبرعك العام سيدعم القسم بأكمله.
                </p>
                <Button
                  onClick={() => {
                    setTargetReqId(undefined);
                    setOpen(true);
                  }}
                  className="mt-6 rounded-full bg-gradient-to-l from-gold to-amber-400 text-gold-foreground shadow-gold"
                >
                  تبرع للقسم الآن
                </Button>
              </div>
            </Reveal>
          ) : (
            <StaggerContainer className="mt-10 grid md:grid-cols-2 gap-6">
              {requests.map((r) => {
                const pct = r.amountNeeded > 0 ? Math.min(100, (r.amountRaised / r.amountNeeded) * 100) : 0;
                return (
                  <StaggerItem key={r.id}>
                    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm hover:shadow-elegant transition-shadow h-full flex flex-col">
                      <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-xl bg-muted text-primary shrink-0">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{r.anonymous ? "مستفيد مجهول" : r.userName}</div>
                          <div className="text-xs text-muted-foreground truncate">{r.title}</div>
                        </div>
                      </div>
                      <p className="mt-4 text-sm text-muted-foreground leading-relaxed line-clamp-4 flex-1">
                        {r.description}
                      </p>
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-muted-foreground">جُمع</span>
                          <span className="font-semibold text-primary">
                            {r.amountRaised.toLocaleString("ar")} / {r.amountNeeded.toLocaleString("ar")} د.أ
                          </span>
                        </div>
                        <Progress value={pct} />
                      </div>
                      <Button
                        onClick={() => {
                          setTargetReqId(r.id);
                          setOpen(true);
                        }}
                        className="mt-5 w-full rounded-full bg-gradient-to-l from-gold to-amber-400 text-gold-foreground shadow-gold"
                      >
                        ادعم هذه الحالة
                      </Button>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* Other categories */}
      <section className="py-24 bg-muted/40 border-t border-border">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-4xl font-bold leading-[1.5]">أقسام أخرى تنتظر عطاءك</h2>
              <p className="text-lg text-muted-foreground mt-2">أوجه أخرى للخير قد تلامس قلبك.</p>
            </div>
            <Link
              to="/categories"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
            >
              كل الأقسام <ArrowLeft className="h-4 w-4" />
            </Link>
          </Reveal>

          <StaggerContainer className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((c) => (
              <StaggerItem key={c.slug}>
                <Link
                  to="/categories/$slug"
                  params={{ slug: c.slug }}
                  className="group block overflow-hidden rounded-3xl border border-border bg-card shadow-sm hover:shadow-elegant transition-all"
                >
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={c.image}
                      alt={c.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/70 to-transparent" />
                  </div>
                  <div className="p-4">
                    <div className="font-display font-bold text-foreground">{c.title}</div>
                    <div className="mt-1 text-xs text-gold font-semibold">{c.short}</div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <DonateDialog
        open={open}
        onOpenChange={setOpen}
        categorySlug={targetReqId ? undefined : cat.slug}
        requestId={targetReqId}
        title={targetReqId ? "دعم هذه الحالة" : `تبرع لقسم ${cat.title}`}
      />

      <Footer />
    </div>
  );
}
