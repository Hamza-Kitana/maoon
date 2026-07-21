import { Reveal } from "./Reveal";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Heart, FileText, ShieldCheck, Lock, BadgeCheck, MousePointerClick, CreditCard, LineChart } from "lucide-react";
import { useContent } from "@/store/content";

const TRUST_ICONS = [ShieldCheck, Lock, BadgeCheck];
const STEP_ICONS = [MousePointerClick, CreditCard, LineChart];
const STEP_NUMS = ["١", "٢", "٣", "٤", "٥"];

export function CTASection() {
  const c = useContent((s) => s.content.cta);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#e8f2ec] text-foreground">
      {/* Soft sage wash — cool & light, distinct from emerald categories above */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,oklch(0.92_0.05_160_/_0.9),transparent_55%),radial-gradient(ellipse_at_bottom_right,oklch(0.88_0.08_85_/_0.35),transparent_50%)]" />
      <div className="absolute inset-0 animate-gradient-pan opacity-50 bg-[linear-gradient(130deg,#e8f2ec_0%,#dceee4_40%,#eef6f1_70%,#f3f8f5_100%)]" />

      {/* Soft drifting orbs */}
      <div className="pointer-events-none absolute -top-24 left-[10%] h-[26rem] w-[26rem] rounded-full bg-primary/10 blur-3xl animate-drift" />
      <div
        className="pointer-events-none absolute -bottom-28 right-[8%] h-[24rem] w-[24rem] rounded-full bg-gold/20 blur-3xl animate-drift"
        style={{ animationDelay: "5s" }}
      />

      <div className="absolute inset-x-0 top-0 hairline-gold" />
      <div className="absolute inset-x-0 bottom-0 hairline-gold" />

      <div className="relative mx-auto w-full max-w-[1700px] px-4 sm:px-6 lg:px-12 py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-4 py-1.5 text-xs font-semibold text-primary shadow-sm">
              <Heart className="h-3.5 w-3.5 text-gold" />
              {c.badge}
            </div>
            <h2 className="mt-6 font-display text-4xl md:text-6xl font-bold leading-[1.6] text-foreground">
              {c.title}{" "}
              <span className="text-gradient-gold">{c.titleHighlight}</span>
            </h2>
            <p className="mt-5 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
              {c.desc}
            </p>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              {c.trust.map((label, i) => {
                const Icon = TRUST_ICONS[i % TRUST_ICONS.length];
                return (
                  <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon className="h-4 w-4 text-primary" />
                    {label}
                  </div>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="rounded-[2rem] border border-primary/10 bg-white/85 backdrop-blur-md p-8 lg:p-10 shadow-elegant">
              <div className="text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-l from-gold to-amber-400 text-gold-foreground shadow-gold">
                  <Heart className="h-6 w-6" />
                </div>
                <div className="mt-4 font-display text-2xl font-bold text-foreground">{c.cardTitle}</div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {c.cardDesc}
                </p>
              </div>
              <div className="mt-8 grid gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-14 w-full rounded-full text-base bg-gradient-to-l from-gold to-amber-400 text-gold-foreground hover:opacity-90 shadow-gold"
                >
                  <Link to="/categories">
                    <Heart className="h-4 w-4" /> {c.btnPrimary}
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-14 w-full rounded-full text-base border-primary/25 bg-transparent text-primary hover:bg-primary/5 hover:text-primary hover:border-gold/60"
                >
                  <Link to="/request">
                    <FileText className="h-4 w-4" /> {c.btnSecondary}
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="mt-16 lg:mt-20 grid gap-5 md:grid-cols-3">
            {c.steps.map((s, i) => {
              const Icon = STEP_ICONS[i % STEP_ICONS.length];
              return (
                <div
                  key={s.title}
                  className="group relative overflow-hidden rounded-3xl border border-primary/10 bg-white/75 backdrop-blur-md p-6 lg:p-7 shadow-sm transition-all duration-300 hover:border-gold/50 hover:shadow-elegant hover:-translate-y-1.5"
                >
                  {/* Ghost number in the corner */}
                  <div className="pointer-events-none absolute -top-4 left-3 font-display text-8xl font-bold text-primary/[0.05] transition-colors duration-300 group-hover:text-gold/20">
                    {STEP_NUMS[i] ?? ""}
                  </div>

                  <div className="relative flex items-center gap-3">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-l from-gold to-amber-400 text-gold-foreground shadow-gold ring-4 ring-gold/20 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="font-display text-xl font-bold text-foreground">{s.title}</div>
                  </div>

                  <div className="hairline-gold mt-5 opacity-60" />
                  <p className="relative mt-4 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
