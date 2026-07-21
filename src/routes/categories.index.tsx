import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { StaggerContainer, StaggerItem } from "@/components/site/Reveal";
import { useCategoriesList } from "@/store/content";
import { useApp } from "@/store/app";

export const Route = createFileRoute("/categories/")({
  head: () => ({
    meta: [
      { title: "الأقسام المدعومة — معوان الخير" },
      {
        name: "description",
        content: "تعرّف على أقسام العطاء العشرة في معوان الخير واختر القسم الذي يلامس قلبك.",
      },
    ],
  }),
  component: CategoriesIndexPage,
});

function CategoriesIndexPage() {
  const requests = useApp((s) => s.requests);
  const categories = useCategoriesList();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-40 pb-24 bg-emerald-deep text-primary-foreground overflow-hidden">
        <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-10 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-4 py-1.5 text-xs font-semibold text-gold">
              الأقسام المدعومة
            </div>
            <h1 className="mt-5 font-display text-4xl md:text-6xl font-bold">
              عشرة أوجه <span className="text-gradient-gold">للعطاء</span>
            </h1>
            <p className="mt-5 text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
              كل قسم يمثل حاجة إنسانية حقيقية درسناها بعناية. تصفح الأقسام، اقرأ تفاصيلها،
              واختر أين يترك عطاؤك أثره.
            </p>
            <div className="hairline-gold w-40 mx-auto mt-8" />
          </motion.div>
        </div>
      </section>

      {/* Categories grid */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto w-full max-w-[1700px] px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {categories.map((c) => {
              const activeCases = requests.filter(
                (r) => r.categorySlug === c.slug && r.status === "approved",
              ).length;
              return (
                <StaggerItem key={c.slug}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="h-full"
                  >
                    <Link
                      to="/categories/$slug"
                      params={{ slug: c.slug }}
                      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:shadow-elegant"
                    >
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={c.image}
                          alt={c.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/80 via-emerald-deep/10 to-transparent" />
                        <div className="absolute bottom-3 right-4 grid h-11 w-11 place-items-center rounded-xl bg-gold text-gold-foreground shadow-gold">
                          <c.icon className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="font-display text-lg font-bold text-foreground">{c.title}</h3>
                        <p className="mt-1 text-xs font-semibold tracking-wide text-gold">{c.short}</p>
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                          {c.desc}
                        </p>
                        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                          <span className="text-xs text-muted-foreground">
                            {activeCases > 0
                              ? `${activeCases.toLocaleString("ar")} حالة نشطة`
                              : "تبرع عام للقسم"}
                          </span>
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2">
                            التفاصيل <ArrowLeft className="h-4 w-4" />
                          </span>
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

      <Footer />
    </div>
  );
}
