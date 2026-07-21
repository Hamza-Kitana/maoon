import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import aboutImg from "@/assets/about.jpg";
import { Reveal } from "./Reveal";
import { ShieldCheck, Eye, Users, HeartHandshake } from "lucide-react";
import { useContent } from "@/store/content";

const PILLAR_ICONS = [ShieldCheck, Eye, Users, HeartHandshake];

export function ImpactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const c = useContent((s) => s.content.impact);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-background">
      {/* Gold separator between the dark hero and this light section */}
      <div className="absolute inset-x-0 top-0 hairline-gold" />

      <div className="relative mx-auto w-full max-w-[1700px] px-4 sm:px-6 lg:px-12 py-20 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20 items-center">
          {/* Text side */}
          <div className="order-2 lg:order-1">
            <Reveal>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-[1.6]">
                {c.title}{" "}
                <span className="text-gradient-gold">{c.titleHighlight}</span>
              </h2>
              <div className="hairline-gold w-32 mt-6" />
              <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-loose">
                {c.desc}
              </p>
            </Reveal>

            <div className="mt-10 grid sm:grid-cols-2 gap-4">
              {c.pillars.map((p, i) => {
                const Icon = PILLAR_ICONS[i % PILLAR_ICONS.length];
                return (
                  <Reveal key={p.title} delay={i * 0.08}>
                    <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-elegant hover:border-gold/60 hover:-translate-y-1">
                      {/* Soft gold glow on hover */}
                      <div className="pointer-events-none absolute -top-10 -left-10 h-28 w-28 rounded-full bg-gold/15 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {/* Side accent bar */}
                      <div className="absolute inset-y-4 right-0 w-1 rounded-full bg-gradient-to-b from-gold to-amber-400 opacity-60 group-hover:opacity-100 group-hover:inset-y-2 transition-all duration-300" />

                      <div className="relative flex items-center gap-4">
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-emerald-deep text-primary-foreground shadow-elegant transition-transform duration-300 group-hover:scale-110">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="font-display text-lg font-bold text-foreground">{p.title}</div>
                      </div>
                      <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground border-t border-border/70 pt-3">
                        {p.desc}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* Image side */}
          <motion.div style={{ y }} className="relative order-1 lg:order-2 will-change-transform [transform:translateZ(0)]">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-tr from-gold/20 via-transparent to-primary/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-border shadow-elegant">
              <img
                src={c.image || aboutImg}
                alt="أسر مستفيدة"
                className="h-[380px] w-full object-cover lg:h-[540px]"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 right-6 left-6 rounded-2xl bg-white/95 backdrop-blur p-5 shadow-elegant">
                <div className="text-xs uppercase tracking-widest text-primary font-semibold">{c.storyLabel}</div>
                <div className="mt-1 font-display text-lg font-bold text-foreground">
                  {c.storyQuote}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{c.storyAuthor}</div>
              </div>
            </div>

            {/* Floating accent card */}
            <div className="absolute -top-5 -right-3 lg:-right-6 rounded-2xl bg-gradient-to-l from-gold to-amber-400 px-6 py-4 text-gold-foreground shadow-gold">
              <div className="font-display text-2xl font-bold">{c.badgeValue}</div>
              <div className="text-xs font-semibold">{c.badgeLabel}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
