import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useMemo } from "react";
import {
  DEFAULT_CATEGORIES,
  resolveCategory,
  type Category,
  type CategoryData,
} from "@/lib/categories";

/* ------------------------------------------------------------------ */
/* Editable site content                                               */
/* ------------------------------------------------------------------ */

export type SiteContent = {
  brand: {
    name: string;
    tagline: string;
  };
  hero: {
    badge: string;
    title1: string;
    titleHighlight: string;
    title2: string;
    subtitle: string;
    btnPrimary: string;
    btnSecondary: string;
    image: string; // "" = default bundled image
  };
  impact: {
    title: string;
    titleHighlight: string;
    desc: string;
    pillars: { title: string; desc: string }[];
    storyLabel: string;
    storyQuote: string;
    storyAuthor: string;
    badgeValue: string;
    badgeLabel: string;
    image: string;
  };
  categoriesSection: {
    title: string;
    subtitle: string;
  };
  cta: {
    badge: string;
    title: string;
    titleHighlight: string;
    desc: string;
    trust: string[];
    cardTitle: string;
    cardDesc: string;
    btnPrimary: string;
    btnSecondary: string;
    steps: { title: string; desc: string }[];
  };
  about: {
    heroTitle: string;
    heroHighlight: string;
    heroDesc: string;
    heroImage: string;
    storyBadge: string;
    storyTitle: string;
    storyHighlight: string;
    storyP1: string;
    storyP2: string;
    storyImage: string;
    storyBadgeValue: string;
    storyBadgeLabel: string;
    pillarsTitle: string;
    pillars: { label: string; title: string; desc: string; image: string }[];
    principlesTitle: string;
    principles: { title: string; desc: string }[];
    ctaTitle: string;
    ctaDesc: string;
  };
  contact: {
    title: string;
    titleHighlight: string;
    desc: string;
    phone: string;
    email: string;
    address: string;
  };
  footer: {
    about: string;
    phone: string;
    email: string;
    address: string;
  };
};

export const DEFAULT_CONTENT: SiteContent = {
  brand: {
    name: "معوان الخير",
    tagline: "National Aid Portal",
  },
  hero: {
    badge: "مبادرة حكومية للتكافل الاجتماعي",
    title1: "حين يجتمع",
    titleHighlight: "العطاء",
    title2: "تُبنى الحياة من جديد",
    subtitle:
      "منصة موثوقة تجمع تبرعاتكم لدعم الغارمين، الأسر المتعففة، الطلبة، والمرضى بشفافية كاملة ورقابة مباشرة.",
    btnPrimary: "ابدأ بالتبرع",
    btnSecondary: "اطلب مساعدة",
    image: "",
  },
  impact: {
    title: "عطاءٌ يصل.",
    titleHighlight: "وأثرٌ يبقى.",
    desc: "معوان الخير هو مبادرة حكومية تعمل كجسر موثوق بين المتبرعين والمستحقين، بمنهجية علمية وإشراف مباشر من لجان متخصصة، ضامنةً وصول كل قرش إلى مستحقه.",
    pillars: [
      { title: "شفافية كاملة", desc: "كل تبرع يُوثّق ويُتبع حتى وصوله." },
      { title: "رقابة مباشرة", desc: "لجنة حكومية تدقّق كل حالة قبل الاعتماد." },
      { title: "لجنة متخصصة", desc: "خبراء اجتماعيون يقيّمون الأولوية." },
      { title: "كرامة المستفيد", desc: "خصوصية تامة وسرية للبيانات." },
    ],
    storyLabel: "قصة نجاح",
    storyQuote: "\"استعدنا شهادة ابننا وعاد إلى مقعده الجامعي\"",
    storyAuthor: "— أسرة من محافظة إربد",
    badgeValue: "١٠٠٪",
    badgeLabel: "من تبرعك يصل لمستحقيه",
    image: "",
  },
  categoriesSection: {
    title: "عشرة أوجه للعطاء",
    subtitle: "اختر القسم الذي يلامس قلبك، أو ادعم شخصاً بعينه بكامل تفاصيله.",
  },
  cta: {
    badge: "انضم إلى آلاف المتبرعين",
    title: "ابدأ عطاءك اليوم.",
    titleHighlight: "غيّر حياةً غداً.",
    desc: "سواء رغبت بالمساهمة بمبلغ رمزي أو دعم حالة كاملة، كل خطوة تُحدث فرقاً حقيقياً في حياة أسرة تنتظر.",
    trust: ["رقابة حكومية مباشرة", "دفع آمن ومشفّر", "١٠٠٪ من تبرعك يصل"],
    cardTitle: "كن سبباً في الفرج",
    cardDesc: "تبرعك يصل مباشرة — بدون تسجيل وبدون تعقيد.",
    btnPrimary: "تبرع الآن",
    btnSecondary: "قدم طلب مساعدة",
    steps: [
      { title: "اختر القسم", desc: "تصفح الأقسام العشرة واختر الوجه الذي يلامس قلبك." },
      { title: "تبرع بأمان", desc: "ادفع ببطاقتك خلال ثوانٍ عبر بوابة مشفّرة وآمنة." },
      { title: "تابع الأثر", desc: "يصلك توثيق كامل لوصول تبرعك إلى مستحقيه." },
    ],
  },
  about: {
    heroTitle: "نحو مجتمع",
    heroHighlight: "متكافل",
    heroDesc:
      "معوان الخير منصة حكومية أُنشئت لتنظيم عمل الخير وإيصاله بأمانة لمستحقيه، بالتعاون مع لجان متخصصة وشركاء وطنيين موثوقين.",
    heroImage: "",
    storyBadge: "قصتنا",
    storyTitle: "بدأنا من سؤال بسيط:",
    storyHighlight: "كيف يصل الخير لمستحقيه؟",
    storyP1:
      "في كل حي أسرة متعففة لا تمد يدها، وفي كل جامعة طالب يوشك أن يترك مقعده، وخلف كل باب قصة تحتاج من يسمعها. أُنشئ معوان الخير ليكون الجسر الموثوق بين من يريد العطاء ومن يستحقه — بمنهجية علمية، ولجان بحث اجتماعي ميدانية، وشفافية كاملة تجعل كل متبرع يعرف أين وصل أثره.",
    storyP2:
      "اليوم، عبر عشرة أقسام إنسانية تغطي الديون والسكن والتعليم والصحة والإغاثة، نعمل كل يوم ليصل عطاؤكم إلى من ينتظره.",
    storyImage: "",
    storyBadgeValue: "١٠",
    storyBadgeLabel: "أقسام تغطي الحاجات الأساسية",
    pillarsTitle: "رسالتنا، رؤيتنا، وقيمنا",
    pillars: [
      {
        label: "رسالتنا",
        title: "عطاء منظم يصل بأمانة",
        desc: "بناء منظومة عطاء وطنية شفافة تجمع التبرعات وتوصلها إلى كل محتاج بعد دراسة وتدقيق، لتكون يد الخير ممتدة دائماً حيث يجب أن تكون.",
        image: "",
      },
      {
        label: "رؤيتنا",
        title: "المرجع الأول للتكافل",
        desc: "أن نكون المرجع الأول للتكافل الاجتماعي في المنطقة، ونموذجاً يُحتذى في الشفافية والكفاءة وسرعة الاستجابة للحالات الإنسانية.",
        image: "",
      },
      {
        label: "قيمنا",
        title: "مبادئ لا نساوم عليها",
        desc: "النزاهة في كل قرش، الشفافية في كل خطوة، كرامة المستفيد فوق كل اعتبار، والاستدامة في كل مبادرة نطلقها.",
        image: "",
      },
    ],
    principlesTitle: "أربعة مبادئ تحكم كل قرار",
    principles: [
      { title: "النزاهة", desc: "تدقيق مالي مستقل على كل عملية." },
      { title: "الشفافية", desc: "تقارير دورية معلنة للجميع." },
      { title: "الكرامة", desc: "سرية تامة لبيانات المستفيدين." },
      { title: "الاستدامة", desc: "حلول تُخرج الأسر من دائرة الحاجة." },
    ],
    ctaTitle: "كن جزءاً من القصة",
    ctaDesc: "كل تبرع — مهما كان حجمه — يكتب فصلاً جديداً في حياة أسرة تنتظر الفرج.",
  },
  contact: {
    title: "نحن هنا",
    titleHighlight: "للإصغاء",
    desc: "للاستفسارات، الشكاوى، أو الاقتراحات — لا تتردد بالتواصل مع فريقنا المختص.",
    phone: "195 000 000",
    email: "info@aid.gov",
    address: "عمّان، شارع الملكة رانيا",
  },
  footer: {
    about: "منصة حكومية موثوقة لدعم الفئات الأكثر احتياجاً بشفافية كاملة ورقابة مباشرة.",
    phone: "000 000 195",
    email: "info@aid.gov",
    address: "عمّان — المملكة الأردنية",
  },
};

/* ------------------------------------------------------------------ */
/* Store                                                               */
/* ------------------------------------------------------------------ */

type ContentState = {
  content: SiteContent;
  categories: CategoryData[];

  setSection: <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void;
  resetSection: <K extends keyof SiteContent>(key: K) => void;
  resetAllContent: () => void;

  addCategory: (c: CategoryData) => void;
  updateCategory: (slug: string, patch: Partial<CategoryData>) => void;
  deleteCategory: (slug: string) => void;
  resetCategories: () => void;
};

export const useContent = create<ContentState>()(
  persist(
    (set, get) => ({
      content: DEFAULT_CONTENT,
      categories: DEFAULT_CATEGORIES,

      setSection: (key, value) => set({ content: { ...get().content, [key]: value } }),
      resetSection: (key) =>
        set({ content: { ...get().content, [key]: DEFAULT_CONTENT[key] } }),
      resetAllContent: () => set({ content: DEFAULT_CONTENT }),

      addCategory: (c) => set({ categories: [...get().categories, c] }),
      updateCategory: (slug, patch) =>
        set({
          categories: get().categories.map((c) => (c.slug === slug ? { ...c, ...patch } : c)),
        }),
      deleteCategory: (slug) =>
        set({ categories: get().categories.filter((c) => c.slug !== slug) }),
      resetCategories: () => set({ categories: DEFAULT_CATEGORIES }),
    }),
    {
      name: "aid-portal-content",
      version: 1,
      merge: (persisted, current) => {
        // Deep-merge persisted content over defaults so newly added fields
        // in future versions keep their default values.
        const p = persisted as Partial<ContentState> | undefined;
        if (!p) return current;
        const mergedContent: SiteContent = { ...current.content };
        if (p.content) {
          for (const key of Object.keys(mergedContent) as (keyof SiteContent)[]) {
            if (p.content[key]) {
              mergedContent[key] = { ...mergedContent[key], ...p.content[key] } as never;
            }
          }
        }
        return {
          ...current,
          ...p,
          content: mergedContent,
          categories: p.categories && p.categories.length > 0 ? p.categories : current.categories,
        };
      },
    },
  ),
);

/* ------------------------------------------------------------------ */
/* Hooks                                                               */
/* ------------------------------------------------------------------ */

/** All categories, with icon component and image resolved. */
export function useCategoriesList(): Category[] {
  const raw = useContent((s) => s.categories);
  return useMemo(() => raw.map(resolveCategory), [raw]);
}

/** Single category by slug (resolved), or undefined. */
export function useCategoryBySlug(slug: string): Category | undefined {
  const raw = useContent((s) => s.categories);
  return useMemo(() => {
    const found = raw.find((c) => c.slug === slug);
    return found ? resolveCategory(found) : undefined;
  }, [raw, slug]);
}
