import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { useApp } from "@/store/app";
import { useContent, useCategoriesList } from "@/store/content";

export function Hero() {
  const donations = useApp((s) => s.donations);
  const total = donations.reduce((a, d) => a + d.amount, 0);
  const requests = useApp((s) => s.requests.filter((r) => r.status === "approved").length);
  const c = useContent((s) => s.content.hero);
  const categoriesCount = useCategoriesList().length;

  return (
    <section className="relative min-h-screen w-full overflow-hidden text-white flex items-center">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={c.image || heroImg}
          alt="أيادي العطاء"
          decoding="async"
          fetchPriority="high"
          className="h-full w-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-emerald-deep/95 via-emerald-deep/70 to-emerald-deep/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep via-transparent to-transparent" />
      </div>

      {/* Floating orbs */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-96 w-96 rounded-full bg-gold/20 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl animate-float-slow" style={{ animationDelay: "2s" }} />

      <div className="relative mx-auto w-full max-w-[1700px] px-4 sm:px-6 lg:px-12 pt-32 pb-16 lg:pt-36 lg:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-4 py-1.5 text-xs font-medium text-gold backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            {c.badge}
          </div>

          <h1 className="mt-6 font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.6]">
            {c.title1}{" "}
            <span className="text-gradient-gold">{c.titleHighlight}</span>
            <br />
            {c.title2}
          </h1>

          <p className="mt-6 max-w-xl text-lg md:text-xl text-white/85 leading-relaxed">
            {c.subtitle}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-14 px-8 rounded-full text-base bg-gradient-to-l from-gold to-amber-400 text-gold-foreground shadow-gold hover:opacity-90"
            >
              <Link to="/" hash="categories">
                {c.btnPrimary} <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 px-8 rounded-full text-base bg-white/5 border-white/30 text-white hover:bg-white/15 hover:text-white hover:border-gold/60"
            >
              <Link to="/auth">{c.btnSecondary}</Link>
            </Button>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-16 grid grid-cols-3 gap-6 max-w-2xl"
          >
            {[
              { label: "إجمالي التبرعات", value: `${total.toLocaleString("ar")} د.أ` },
              { label: "حالات مدعومة", value: requests.toLocaleString("ar") },
              { label: "قسم إنساني", value: categoriesCount.toLocaleString("ar") },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md p-4">
                <div className="font-display text-2xl md:text-3xl text-gold">{s.value}</div>
                <div className="text-xs md:text-sm text-white/70 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
}
