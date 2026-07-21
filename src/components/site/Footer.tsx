import { Link } from "@tanstack/react-router";
import { HandCoins, Mail, Phone, MapPin } from "lucide-react";
import { useContent, useCategoriesList } from "@/store/content";

export function Footer() {
  const brand = useContent((s) => s.content.brand);
  const footer = useContent((s) => s.content.footer);
  const categories = useCategoriesList();

  return (
    <footer className="relative bg-emerald-deep text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06] bg-[url('/pattern.svg')]" />
      <div className="hairline-gold" />
      <div className="relative mx-auto w-full max-w-[1700px] px-4 sm:px-6 lg:px-12 py-16 grid gap-10 lg:grid-cols-4">
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gold text-gold-foreground">
              <HandCoins className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-lg font-bold">{brand.name}</div>
              <div className="text-[10px] text-gold tracking-widest uppercase">{brand.tagline}</div>
            </div>
          </div>
          <p className="text-sm text-primary-foreground/70 leading-relaxed">
            {footer.about}
          </p>
        </div>

        <div>
          <h4 className="font-display text-gold mb-4">روابط سريعة</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/" className="hover:text-gold">الرئيسية</Link></li>
            <li><Link to="/about" className="hover:text-gold">من نحن</Link></li>
            <li><Link to="/categories" className="hover:text-gold">الأقسام المدعومة</Link></li>
            <li><Link to="/contact" className="hover:text-gold">تواصل معنا</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-gold mb-4">أقسام مختارة</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            {categories.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link to="/categories/$slug" params={{ slug: c.slug }} className="hover:text-gold">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-gold mb-4">تواصل</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> {footer.phone}</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> {footer.email}</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" /> {footer.address}</li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10 py-5 text-center text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} {brand.name}. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
