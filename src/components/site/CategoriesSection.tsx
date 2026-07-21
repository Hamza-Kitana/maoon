import { Link } from "@tanstack/react-router";
import { Reveal, StaggerContainer, StaggerItem } from "./Reveal";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { CSSProperties } from "react";
import { useContent, useCategoriesList } from "@/store/content";

// Per-category color identity: [aurora edge A, aurora edge B, inner tint, icon gradient]
const CARD_COLORS: Record<string, { a: string; b: string; tint: string; icon: string }> = {
  gharemoon: {
    a: "oklch(0.8 0.15 82)",
    b: "oklch(0.62 0.16 55)",
    tint: "oklch(0.7 0.14 70 / 0.16)",
    icon: "linear-gradient(135deg, oklch(0.82 0.15 85), oklch(0.65 0.16 55))",
  },
  rent: {
    a: "oklch(0.78 0.13 175)",
    b: "oklch(0.6 0.12 200)",
    tint: "oklch(0.7 0.12 185 / 0.16)",
    icon: "linear-gradient(135deg, oklch(0.8 0.13 175), oklch(0.58 0.12 205))",
  },
  "univ-held": {
    a: "oklch(0.75 0.16 300)",
    b: "oklch(0.58 0.18 280)",
    tint: "oklch(0.65 0.16 290 / 0.16)",
    icon: "linear-gradient(135deg, oklch(0.76 0.16 300), oklch(0.56 0.18 278))",
  },
  students: {
    a: "oklch(0.78 0.13 235)",
    b: "oklch(0.6 0.15 255)",
    tint: "oklch(0.68 0.13 245 / 0.16)",
    icon: "linear-gradient(135deg, oklch(0.79 0.13 235), oklch(0.58 0.15 258))",
  },
  water: {
    a: "oklch(0.82 0.12 210)",
    b: "oklch(0.62 0.13 230)",
    tint: "oklch(0.72 0.12 220 / 0.16)",
    icon: "linear-gradient(135deg, oklch(0.83 0.12 210), oklch(0.6 0.13 232))",
  },
  electricity: {
    a: "oklch(0.88 0.16 95)",
    b: "oklch(0.72 0.17 75)",
    tint: "oklch(0.8 0.16 85 / 0.16)",
    icon: "linear-gradient(135deg, oklch(0.88 0.16 95), oklch(0.7 0.17 72))",
  },
  elderly: {
    a: "oklch(0.78 0.13 20)",
    b: "oklch(0.62 0.16 350)",
    tint: "oklch(0.7 0.14 5 / 0.16)",
    icon: "linear-gradient(135deg, oklch(0.79 0.13 22), oklch(0.6 0.16 348))",
  },
  disability: {
    a: "oklch(0.72 0.14 265)",
    b: "oklch(0.56 0.17 285)",
    tint: "oklch(0.64 0.15 275 / 0.16)",
    icon: "linear-gradient(135deg, oklch(0.73 0.14 263), oklch(0.54 0.17 288))",
  },
  medical: {
    a: "oklch(0.72 0.17 25)",
    b: "oklch(0.56 0.2 15)",
    tint: "oklch(0.64 0.18 20 / 0.16)",
    icon: "linear-gradient(135deg, oklch(0.73 0.17 27), oklch(0.55 0.2 12))",
  },
  disasters: {
    a: "oklch(0.76 0.17 55)",
    b: "oklch(0.6 0.19 35)",
    tint: "oklch(0.68 0.18 45 / 0.16)",
    icon: "linear-gradient(135deg, oklch(0.77 0.17 57), oklch(0.58 0.19 33))",
  },
};

// Fallback palette cycled for admin-added categories without a preset identity
const CARD_PALETTE = Object.values(CARD_COLORS);

export function CategoriesSection() {
  const section = useContent((s) => s.content.categoriesSection);
  const categories = useCategoriesList();

  return (
    <section
      id="categories"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden scroll-mt-24 bg-gradient-to-br from-emerald-deep via-primary to-emerald-deep animate-gradient-pan text-white"
    >
      {/* Animated ambient orbs */}
      <div className="pointer-events-none absolute -top-32 right-[8%] h-[30rem] w-[30rem] rounded-full bg-gold/15 blur-3xl animate-drift" />
      <div
        className="pointer-events-none absolute -bottom-32 left-[5%] h-[26rem] w-[26rem] rounded-full bg-emerald-400/15 blur-3xl animate-drift"
        style={{ animationDelay: "4s" }}
      />
      <div
        className="pointer-events-none absolute top-1/3 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl animate-drift"
        style={{ animationDelay: "8s" }}
      />

      {/* Gold hairlines framing the section */}
      <div className="absolute inset-x-0 top-0 hairline-gold" />
      <div className="absolute inset-x-0 bottom-0 hairline-gold" />

      <div className="relative mx-auto w-full max-w-[1700px] px-4 sm:px-6 lg:px-12 py-20 lg:py-24">
        <Reveal className="text-center max-w-3xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            {section.title}
          </h2>
          <p className="mt-4 text-lg text-white/75">
            {section.subtitle}
          </p>
          <div className="hairline-gold w-40 mx-auto mt-7" />
        </Reveal>

        <StaggerContainer className="mt-12 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((c, i) => {
            const colors = CARD_COLORS[c.slug] ?? CARD_PALETTE[i % CARD_PALETTE.length];
            return (
              <StaggerItem key={c.slug}>
                <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <Link
                    to="/categories/$slug"
                    params={{ slug: c.slug }}
                    className="card-aurora group relative block h-full rounded-3xl p-5 shadow-sm transition-shadow duration-300 hover:shadow-elegant"
                    style={
                      {
                        "--aurora-a": colors.a,
                        "--aurora-b": colors.b,
                        "--aurora-tint": colors.tint,
                        // Desynchronize the rotating borders so they don't all spin in step
                        "--aurora-delay": `${i * -0.7}s`,
                      } as CSSProperties
                    }
                  >
                    <div className="relative">
                      <div
                        className="grid h-13 w-13 place-items-center rounded-2xl text-white shadow-elegant transition-transform duration-300 group-hover:scale-110"
                        style={{ background: colors.icon }}
                      >
                        <c.icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 font-display text-xl font-bold text-white">{c.title}</h3>
                      <p className="mt-1 text-xs font-semibold text-gold tracking-wide">{c.short}</p>
                      <p className="mt-2.5 text-sm text-white/70 leading-relaxed line-clamp-2">{c.desc}</p>
                      <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold group-hover:gap-2 transition-all">
                        تبرع الآن <ArrowLeft className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
