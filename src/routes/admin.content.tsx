import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SectionCard, Field, AreaField, ImageField } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import { useContent, DEFAULT_CONTENT, type SiteContent } from "@/store/content";
import { toast } from "sonner";
import { Save, RotateCcw, Home, Info, Fingerprint } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import aboutImg from "@/assets/about.jpg";
import imgDisasters from "@/assets/categories/cat-disasters.jpg";
import imgElderly from "@/assets/categories/cat-elderly.jpg";
import imgDisability from "@/assets/categories/cat-disability.jpg";

type Tab = "home" | "about" | "brand";

const TABS: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "الصفحة الرئيسية", icon: Home },
  { id: "about", label: "صفحة من نحن", icon: Info },
  { id: "brand", label: "الهوية والتواصل", icon: Fingerprint },
];

const TAB_SECTIONS: Record<Tab, (keyof SiteContent)[]> = {
  home: ["hero", "impact", "categoriesSection", "cta"],
  about: ["about"],
  brand: ["brand", "footer", "contact"],
};

const PILLAR_DEFAULT_IMAGES = [imgDisasters, imgDisability, imgElderly];

export const Route = createFileRoute("/admin/content")({
  validateSearch: (search: Record<string, unknown>): { tab: Tab } => ({
    tab: (["home", "about", "brand"].includes(search.tab as string) ? search.tab : "home") as Tab,
  }),
  component: AdminContent,
});

function AdminContent() {
  const { tab } = Route.useSearch();
  const nav = useNavigate({ from: Route.fullPath });
  const content = useContent((s) => s.content);
  const setSection = useContent((s) => s.setSection);
  const [draft, setDraft] = useState<SiteContent>(content);

  const up = <K extends keyof SiteContent>(key: K, patch: Partial<SiteContent[K]>) =>
    setDraft((d) => ({ ...d, [key]: { ...d[key], ...patch } }));

  const save = () => {
    for (const key of TAB_SECTIONS[tab]) setSection(key, draft[key]);
    toast.success("تم حفظ التغييرات — الموقع محدّث الآن");
  };

  const restoreDefaults = () => {
    const next = { ...draft };
    for (const key of TAB_SECTIONS[tab]) {
      next[key] = DEFAULT_CONTENT[key] as never;
      setSection(key, DEFAULT_CONTENT[key]);
    }
    setDraft(next);
    toast.success("تمت استعادة المحتوى الافتراضي لهذا التبويب");
  };

  return (
    <>
      <AdminHeader title="محتوى الموقع" subtitle="عدّل نصوص وصور كل صفحات الموقع" />
      <div className="p-8 max-w-5xl">
        {/* Tabs + actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex rounded-xl border border-border bg-card p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => nav({ search: { tab: t.id } })}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  tab === t.id
                    ? "bg-emerald-deep text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={restoreDefaults}>
              <RotateCcw className="h-4 w-4" /> استعادة الافتراضي
            </Button>
            <Button onClick={save} className="bg-gradient-to-l from-gold to-amber-400 text-gold-foreground shadow-gold">
              <Save className="h-4 w-4" /> حفظ التغييرات
            </Button>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {tab === "home" && <HomeTab draft={draft} up={up} />}
          {tab === "about" && <AboutTab draft={draft} up={up} />}
          {tab === "brand" && <BrandTab draft={draft} up={up} />}
        </div>

        {/* Bottom save for long forms */}
        <div className="mt-8 flex justify-end">
          <Button size="lg" onClick={save} className="bg-gradient-to-l from-gold to-amber-400 text-gold-foreground shadow-gold">
            <Save className="h-4 w-4" /> حفظ التغييرات
          </Button>
        </div>
      </div>
    </>
  );
}

type TabProps = {
  draft: SiteContent;
  up: <K extends keyof SiteContent>(key: K, patch: Partial<SiteContent[K]>) => void;
};

function HomeTab({ draft, up }: TabProps) {
  const { hero, impact, categoriesSection, cta } = draft;
  return (
    <>
      <SectionCard title="القسم الافتتاحي (Hero)" desc="أول ما يراه الزائر عند فتح الموقع">
        <ImageField label="صورة الخلفية" value={hero.image} defaultImage={heroImg} onChange={(v) => up("hero", { image: v })} />
        <Field label="الشارة العلوية" value={hero.badge} onChange={(v) => up("hero", { badge: v })} />
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="العنوان — الجزء الأول" value={hero.title1} onChange={(v) => up("hero", { title1: v })} />
          <Field label="الكلمة الذهبية" value={hero.titleHighlight} onChange={(v) => up("hero", { titleHighlight: v })} />
          <Field label="العنوان — الجزء الثاني" value={hero.title2} onChange={(v) => up("hero", { title2: v })} />
        </div>
        <AreaField label="النص التعريفي" value={hero.subtitle} onChange={(v) => up("hero", { subtitle: v })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="نص الزر الرئيسي" value={hero.btnPrimary} onChange={(v) => up("hero", { btnPrimary: v })} />
          <Field label="نص الزر الثانوي" value={hero.btnSecondary} onChange={(v) => up("hero", { btnSecondary: v })} />
        </div>
      </SectionCard>

      <SectionCard title="قسم الأثر (عطاءٌ يصل)" desc="القسم الثاني في الصفحة الرئيسية">
        <ImageField label="الصورة الجانبية" value={impact.image} defaultImage={aboutImg} onChange={(v) => up("impact", { image: v })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="العنوان" value={impact.title} onChange={(v) => up("impact", { title: v })} />
          <Field label="الجزء الذهبي من العنوان" value={impact.titleHighlight} onChange={(v) => up("impact", { titleHighlight: v })} />
        </div>
        <AreaField label="النص التعريفي" value={impact.desc} onChange={(v) => up("impact", { desc: v })} />
        <div className="grid gap-4 sm:grid-cols-2">
          {impact.pillars.map((p, i) => (
            <div key={i} className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
              <div className="text-xs font-bold text-primary">البطاقة {i + 1}</div>
              <Field label="العنوان" value={p.title} onChange={(v) => up("impact", { pillars: impact.pillars.map((x, j) => (j === i ? { ...x, title: v } : x)) })} />
              <Field label="الوصف" value={p.desc} onChange={(v) => up("impact", { pillars: impact.pillars.map((x, j) => (j === i ? { ...x, desc: v } : x)) })} />
            </div>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="عنوان قصة النجاح" value={impact.storyLabel} onChange={(v) => up("impact", { storyLabel: v })} />
          <Field label="نص قصة النجاح" value={impact.storyQuote} onChange={(v) => up("impact", { storyQuote: v })} />
          <Field label="مصدر القصة" value={impact.storyAuthor} onChange={(v) => up("impact", { storyAuthor: v })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="قيمة الشارة الذهبية" value={impact.badgeValue} onChange={(v) => up("impact", { badgeValue: v })} />
          <Field label="نص الشارة الذهبية" value={impact.badgeLabel} onChange={(v) => up("impact", { badgeLabel: v })} />
        </div>
      </SectionCard>

      <SectionCard title="قسم أوجه العطاء" desc="عنوان شبكة أقسام التبرع (تُدار الأقسام نفسها من صفحة أقسام التبرع)">
        <Field label="العنوان" value={categoriesSection.title} onChange={(v) => up("categoriesSection", { title: v })} />
        <AreaField label="النص التعريفي" rows={2} value={categoriesSection.subtitle} onChange={(v) => up("categoriesSection", { subtitle: v })} />
      </SectionCard>

      <SectionCard title="قسم الدعوة للتبرع (CTA)" desc="القسم الأخير قبل التذييل">
        <Field label="الشارة العلوية" value={cta.badge} onChange={(v) => up("cta", { badge: v })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="العنوان" value={cta.title} onChange={(v) => up("cta", { title: v })} />
          <Field label="الجزء الذهبي من العنوان" value={cta.titleHighlight} onChange={(v) => up("cta", { titleHighlight: v })} />
        </div>
        <AreaField label="النص التعريفي" value={cta.desc} onChange={(v) => up("cta", { desc: v })} />
        <div className="grid gap-4 sm:grid-cols-3">
          {cta.trust.map((t, i) => (
            <Field key={i} label={`نقطة الثقة ${i + 1}`} value={t} onChange={(v) => up("cta", { trust: cta.trust.map((x, j) => (j === i ? v : x)) })} />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="عنوان بطاقة التبرع" value={cta.cardTitle} onChange={(v) => up("cta", { cardTitle: v })} />
          <Field label="وصف بطاقة التبرع" value={cta.cardDesc} onChange={(v) => up("cta", { cardDesc: v })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="نص زر التبرع" value={cta.btnPrimary} onChange={(v) => up("cta", { btnPrimary: v })} />
          <Field label="نص زر طلب المساعدة" value={cta.btnSecondary} onChange={(v) => up("cta", { btnSecondary: v })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {cta.steps.map((s, i) => (
            <div key={i} className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
              <div className="text-xs font-bold text-primary">الخطوة {i + 1}</div>
              <Field label="العنوان" value={s.title} onChange={(v) => up("cta", { steps: cta.steps.map((x, j) => (j === i ? { ...x, title: v } : x)) })} />
              <Field label="الوصف" value={s.desc} onChange={(v) => up("cta", { steps: cta.steps.map((x, j) => (j === i ? { ...x, desc: v } : x)) })} />
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}

function AboutTab({ draft, up }: TabProps) {
  const { about } = draft;
  return (
    <>
      <SectionCard title="القسم الافتتاحي" desc="أعلى صفحة من نحن">
        <ImageField label="صورة الخلفية" value={about.heroImage} defaultImage={heroImg} onChange={(v) => up("about", { heroImage: v })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="العنوان" value={about.heroTitle} onChange={(v) => up("about", { heroTitle: v })} />
          <Field label="الكلمة الذهبية" value={about.heroHighlight} onChange={(v) => up("about", { heroHighlight: v })} />
        </div>
        <AreaField label="النص التعريفي" value={about.heroDesc} onChange={(v) => up("about", { heroDesc: v })} />
      </SectionCard>

      <SectionCard title="قسم قصتنا">
        <ImageField label="الصورة الجانبية" value={about.storyImage} defaultImage={aboutImg} onChange={(v) => up("about", { storyImage: v })} />
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="الشارة" value={about.storyBadge} onChange={(v) => up("about", { storyBadge: v })} />
          <Field label="العنوان" value={about.storyTitle} onChange={(v) => up("about", { storyTitle: v })} />
          <Field label="الجزء الذهبي" value={about.storyHighlight} onChange={(v) => up("about", { storyHighlight: v })} />
        </div>
        <AreaField label="الفقرة الأولى" rows={4} value={about.storyP1} onChange={(v) => up("about", { storyP1: v })} />
        <AreaField label="الفقرة الثانية" rows={3} value={about.storyP2} onChange={(v) => up("about", { storyP2: v })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="قيمة الشارة الذهبية" value={about.storyBadgeValue} onChange={(v) => up("about", { storyBadgeValue: v })} />
          <Field label="نص الشارة الذهبية" value={about.storyBadgeLabel} onChange={(v) => up("about", { storyBadgeLabel: v })} />
        </div>
      </SectionCard>

      <SectionCard title="رسالتنا، رؤيتنا، وقيمنا">
        <Field label="عنوان القسم" value={about.pillarsTitle} onChange={(v) => up("about", { pillarsTitle: v })} />
        <div className="grid gap-4 lg:grid-cols-3">
          {about.pillars.map((p, i) => (
            <div key={i} className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
              <div className="text-xs font-bold text-primary">البطاقة {i + 1}</div>
              <ImageField
                label="الصورة"
                value={p.image}
                defaultImage={PILLAR_DEFAULT_IMAGES[i % PILLAR_DEFAULT_IMAGES.length]}
                onChange={(v) => up("about", { pillars: about.pillars.map((x, j) => (j === i ? { ...x, image: v } : x)) })}
              />
              <Field label="التصنيف" value={p.label} onChange={(v) => up("about", { pillars: about.pillars.map((x, j) => (j === i ? { ...x, label: v } : x)) })} />
              <Field label="العنوان" value={p.title} onChange={(v) => up("about", { pillars: about.pillars.map((x, j) => (j === i ? { ...x, title: v } : x)) })} />
              <AreaField label="الوصف" value={p.desc} onChange={(v) => up("about", { pillars: about.pillars.map((x, j) => (j === i ? { ...x, desc: v } : x)) })} />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="المبادئ الأربعة">
        <Field label="عنوان القسم" value={about.principlesTitle} onChange={(v) => up("about", { principlesTitle: v })} />
        <div className="grid gap-4 sm:grid-cols-2">
          {about.principles.map((p, i) => (
            <div key={i} className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
              <div className="text-xs font-bold text-primary">المبدأ {i + 1}</div>
              <Field label="العنوان" value={p.title} onChange={(v) => up("about", { principles: about.principles.map((x, j) => (j === i ? { ...x, title: v } : x)) })} />
              <Field label="الوصف" value={p.desc} onChange={(v) => up("about", { principles: about.principles.map((x, j) => (j === i ? { ...x, desc: v } : x)) })} />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="بطاقة الختام (كن جزءاً من القصة)">
        <Field label="العنوان" value={about.ctaTitle} onChange={(v) => up("about", { ctaTitle: v })} />
        <AreaField label="الوصف" rows={2} value={about.ctaDesc} onChange={(v) => up("about", { ctaDesc: v })} />
      </SectionCard>
    </>
  );
}

function BrandTab({ draft, up }: TabProps) {
  const { brand, footer, contact } = draft;
  return (
    <>
      <SectionCard title="هوية الموقع" desc="الاسم الظاهر في الشريط العلوي والتذييل">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="اسم الموقع" value={brand.name} onChange={(v) => up("brand", { name: v })} />
          <Field label="الشعار اللاتيني (تحت الاسم)" value={brand.tagline} onChange={(v) => up("brand", { tagline: v })} />
        </div>
      </SectionCard>

      <SectionCard title="التذييل (Footer)">
        <AreaField label="النبذة التعريفية" rows={2} value={footer.about} onChange={(v) => up("footer", { about: v })} />
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="الهاتف" value={footer.phone} onChange={(v) => up("footer", { phone: v })} />
          <Field label="البريد الإلكتروني" value={footer.email} onChange={(v) => up("footer", { email: v })} />
          <Field label="العنوان" value={footer.address} onChange={(v) => up("footer", { address: v })} />
        </div>
      </SectionCard>

      <SectionCard title="صفحة تواصل معنا">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="العنوان" value={contact.title} onChange={(v) => up("contact", { title: v })} />
          <Field label="الكلمة الذهبية" value={contact.titleHighlight} onChange={(v) => up("contact", { titleHighlight: v })} />
        </div>
        <AreaField label="النص التعريفي" rows={2} value={contact.desc} onChange={(v) => up("contact", { desc: v })} />
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="الخط الساخن" value={contact.phone} onChange={(v) => up("contact", { phone: v })} />
          <Field label="البريد الإلكتروني" value={contact.email} onChange={(v) => up("contact", { email: v })} />
          <Field label="المقر الرئيسي" value={contact.address} onChange={(v) => up("contact", { address: v })} />
        </div>
      </SectionCard>
    </>
  );
}
