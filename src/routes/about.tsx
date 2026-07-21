import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { useApp } from "@/store/app";
import { useContent, useCategoriesList } from "@/store/content";
import {
  Award,
  Target,
  Compass,
  Heart,
  ShieldCheck,
  Scale,
  HeartHandshake,
  Leaf,
  ArrowLeft,
} from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import aboutImg from "@/assets/about.jpg";
import imgDisasters from "@/assets/categories/cat-disasters.jpg";
import imgElderly from "@/assets/categories/cat-elderly.jpg";
import imgDisability from "@/assets/categories/cat-disability.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "من نحن — معوان الخير" },
      { name: "description", content: "تعرّف على رسالة ورؤية وقيم معوان الخير." },
    ],
  }),
  component: About,
});

const PILLAR_ICONS = [Target, Compass, Award];
const PILLAR_DEFAULT_IMAGES = [imgDisasters, imgDisability, imgElderly];
const PRINCIPLE_ICONS = [Scale, ShieldCheck, HeartHandshake, Leaf];

function About() {
  const donations = useApp((s) => s.donations);
  const requests = useApp((s) => s.requests);
  const totalDonated = donations.reduce((a, d) => a + d.amount, 0);
  const approvedCases = requests.filter((r) => r.status === "approved").length;
  const c = useContent((s) => s.content.about);
  const categoriesCount = useCategoriesList().length;

  const stats = [
    { value: `${totalDonated.toLocaleString("ar")} د.أ`, label: "إجمالي التبرعات" },
    { value: approvedCases.toLocaleString("ar"), label: "حالة معتمدة" },
    { value: categoriesCount.toLocaleString("ar"), label: "أقسام إنسانية" },
    { value: "١٠٠٪", label: "من تبرعك يصل" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero with image */}
      <section className="relative min-h-[38vh] flex items-end overflow-hidden bg-emerald-deep text-primary-foreground">
        <img src={c.heroImage || heroImg} alt="أيادي العطاء" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep via-emerald-deep/70 to-emerald-deep/30" />
        <div className="relative mx-auto w-full max-w-[1700px] px-4 sm:px-6 lg:px-12 pb-10 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-4 py-1.5 text-xs font-semibold text-gold">
              من نحن
            </div>
            <h1 className="mt-4 font-display text-4xl md:text-5xl font-bold">
              {c.heroTitle} <span className="text-gradient-gold">{c.heroHighlight}</span>
            </h1>
            <p className="mt-3 text-base md:text-lg text-white/85 leading-loose">
              {c.heroDesc}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats band */}
      <section className="relative bg-emerald-deep text-primary-foreground border-t border-white/10">
        <div className="hairline-gold" />
        <div className="mx-auto w-full max-w-[1700px] px-4 sm:px-6 lg:px-12 py-10">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-3xl md:text-4xl font-bold text-gold">{s.value}</div>
                <div className="mt-1 text-sm text-white/70">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto w-full max-w-[1700px] px-4 sm:px-6 lg:px-12 grid gap-14 lg:grid-cols-2 items-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-primary">
              {c.storyBadge}
            </div>
            <h2 className="mt-5 font-display text-4xl md:text-5xl font-bold text-foreground leading-[1.6]">
              {c.storyTitle}{" "}
              <span className="text-gradient-gold">{c.storyHighlight}</span>
            </h2>
            <div className="hairline-gold w-32 mt-7" />
            <p className="mt-7 text-lg text-muted-foreground leading-loose">
              {c.storyP1}
            </p>
            <p className="mt-4 text-lg text-muted-foreground leading-loose">
              {c.storyP2}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="relative">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-tr from-gold/20 via-transparent to-primary/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-border shadow-elegant">
                <img src={c.storyImage || aboutImg} alt="أسر مستفيدة" className="h-[420px] w-full object-cover lg:h-[520px]" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/60 to-transparent" />
              </div>
              <div className="absolute -bottom-5 -right-3 lg:-right-6 rounded-2xl bg-gradient-to-l from-gold to-amber-400 px-6 py-4 text-gold-foreground shadow-gold">
                <div className="font-display text-2xl font-bold">{c.storyBadgeValue}</div>
                <div className="text-xs font-semibold">{c.storyBadgeLabel}</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission / Vision / Values with images */}
      <section className="py-24 bg-emerald-deep text-primary-foreground relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 left-1/3 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative mx-auto w-full max-w-[1700px] px-4 sm:px-6 lg:px-12">
          <Reveal className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-4 py-1.5 text-xs font-semibold text-gold">
              ما الذي يحركنا؟
            </div>
            <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold">{c.pillarsTitle}</h2>
            <div className="hairline-gold w-32 mx-auto mt-7" />
          </Reveal>

          <StaggerContainer className="mt-16 grid gap-6 md:grid-cols-3">
            {c.pillars.map((p, i) => {
              const Icon = PILLAR_ICONS[i % PILLAR_ICONS.length];
              const image = p.image || PILLAR_DEFAULT_IMAGES[i % PILLAR_DEFAULT_IMAGES.length];
              return (
                <StaggerItem key={p.label}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="h-full"
                  >
                    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/15 bg-white/5 backdrop-blur">
                      <div className="relative h-52 overflow-hidden">
                        <img src={image} alt={p.label} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/90 via-emerald-deep/20 to-transparent" />
                        <div className="absolute bottom-4 right-5 flex items-center gap-3">
                          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gold text-gold-foreground shadow-gold">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="font-display text-xl font-bold text-gold">{p.label}</div>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col p-7">
                        <h3 className="font-display text-2xl font-bold">{p.title}</h3>
                        <p className="mt-3 flex-1 text-white/75 leading-loose">{p.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Principles */}
      <section className="py-24">
        <div className="mx-auto w-full max-w-[1700px] px-4 sm:px-6 lg:px-12">
          <Reveal className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-primary">
              كيف نعمل؟
            </div>
            <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold text-foreground">
              {c.principlesTitle}
            </h2>
            <div className="hairline-gold w-32 mx-auto mt-7" />
          </Reveal>

          <StaggerContainer className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {c.principles.map((p, i) => {
              const Icon = PRINCIPLE_ICONS[i % PRINCIPLE_ICONS.length];
              return (
                <StaggerItem key={p.title}>
                  <div className="group h-full rounded-3xl border border-border bg-card p-7 text-center shadow-sm transition-all hover:shadow-elegant hover:border-gold/50 hover:-translate-y-1">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-emerald-deep text-primary-foreground shadow-elegant">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 font-display text-xl font-bold text-foreground">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          <Reveal className="mt-16 text-center">
            <div className="mx-auto max-w-3xl rounded-[2rem] border border-gold/30 bg-gold/5 p-10">
              <Heart className="mx-auto h-8 w-8 text-gold" />
              <h3 className="mt-4 font-display text-2xl md:text-3xl font-bold text-foreground">
                {c.ctaTitle}
              </h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {c.ctaDesc}
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-13 rounded-full bg-gradient-to-l from-gold to-amber-400 text-gold-foreground shadow-gold hover:opacity-90"
                >
                  <Link to="/categories">
                    تبرع الآن <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-13 rounded-full">
                  <Link to="/contact">تواصل معنا</Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
