import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, X, HandCoins, LogOut, User as UserIcon, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/store/app";
import { useContent } from "@/store/content";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "الرئيسية" },
  { to: "/about", label: "من نحن" },
  { to: "/categories", label: "الأقسام المدعومة" },
  { to: "/contact", label: "تواصل معنا" },
];

// Routes whose top section is a dark emerald hero; everywhere else the page
// starts light, so the navbar text must be dark to stay readable.
const DARK_HERO_PREFIXES = ["/about", "/categories", "/profile"];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hasDarkHero =
    pathname === "/" || DARK_HERO_PREFIXES.some((p) => pathname.startsWith(p));
  const onDark = hasDarkHero && !scrolled;
  const user = useApp((s) => s.currentUser());
  const logout = useApp((s) => s.logout);
  const brand = useContent((s) => s.content.brand);
  const navigate = useNavigate();

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/85 backdrop-blur-xl border-b border-border shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto w-full max-w-[1700px] px-4 sm:px-6 lg:px-12">
        <div className="flex h-18 items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="relative grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-primary to-emerald-deep shadow-elegant">
              <HandCoins className="h-5 w-5 text-primary-foreground" />
              <div className="absolute -inset-0.5 rounded-2xl border border-gold/40 pointer-events-none" />
            </div>
            <div className={`transition-colors ${onDark ? "text-white" : "text-foreground"}`}>
              <div className="font-display text-lg font-bold leading-tight">{brand.name}</div>
              <div className="text-[10px] tracking-widest text-gold uppercase">{brand.tagline}</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => {
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to.startsWith("/#") ? "/" : n.to}
                  hash={n.to.startsWith("/#") ? n.to.slice(2) : undefined}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all ${
                    onDark ? "text-white/90 hover:text-white" : "text-foreground/80 hover:text-primary"
                  } ${active ? "text-primary" : ""}`}
                >
                  {n.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <>
                {user.role === "admin" && (
                  <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/admin" })}>
                    <LayoutDashboard className="h-4 w-4" />
                    لوحة الإدارة
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => navigate({ to: "/profile" })}>
                  <UserIcon className="h-4 w-4" />
                  {user.name.split(" ")[0]}
                </Button>
                <Button variant="ghost" size="icon" onClick={logout} aria-label="خروج">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/auth" })}>
                  تسجيل الدخول
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-l from-gold to-amber-400 text-gold-foreground hover:opacity-90 shadow-gold"
                  onClick={() => navigate({ to: "/categories" })}
                >
                  تبرع الآن
                </Button>
              </>
            )}
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className={`lg:hidden grid place-items-center h-11 w-11 rounded-xl border ${
              onDark ? "border-white/30 text-white" : "border-border text-foreground"
            }`}
            aria-label="القائمة"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-background/98 backdrop-blur-xl border-t border-border"
          >
            <div className="px-6 py-6 space-y-2">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to.startsWith("/#") ? "/" : n.to}
                  hash={n.to.startsWith("/#") ? n.to.slice(2) : undefined}
                  className="block px-4 py-3 rounded-xl text-foreground hover:bg-muted"
                >
                  {n.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-border grid gap-2">
                {user ? (
                  <>
                    {user.role === "admin" && (
                      <Button onClick={() => navigate({ to: "/admin" })} className="w-full justify-start">
                        <LayoutDashboard className="h-4 w-4" /> لوحة الإدارة
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => navigate({ to: "/profile" })} className="w-full">
                      حسابي
                    </Button>
                    <Button variant="ghost" onClick={logout} className="w-full">
                      تسجيل الخروج
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => navigate({ to: "/auth" })} className="w-full">
                      تسجيل الدخول
                    </Button>
                    <Button onClick={() => navigate({ to: "/categories" })} className="w-full bg-gradient-to-l from-gold to-amber-400 text-gold-foreground">
                      تبرع الآن
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
