import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  Users,
  HandCoins,
  LogOut,
  HandHelping,
  Home,
  LayoutGrid,
  PanelsTopLeft,
  Info,
  Fingerprint,
  Settings,
} from "lucide-react";
import { useApp } from "@/store/app";
import { useContent } from "@/store/content";

type NavItem = {
  to: string;
  label: string;
  icon: typeof Home;
  exact?: boolean;
  search?: Record<string, string>;
  /** used to highlight content sub-tabs */
  activeWhen?: (path: string, searchStr: string) => boolean;
};

type NavGroup = { title: string; items: NavItem[] };

const groups: NavGroup[] = [
  {
    title: "نظرة عامة",
    items: [{ to: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, exact: true }],
  },
  {
    title: "العمليات",
    items: [
      { to: "/admin/requests", label: "طلبات المساعدة", icon: FileText },
      { to: "/admin/donations", label: "سجل التبرعات", icon: HandCoins },
      { to: "/admin/users", label: "المستخدمون", icon: Users },
    ],
  },
  {
    title: "إدارة الموقع",
    items: [
      { to: "/admin/categories", label: "أقسام التبرع", icon: LayoutGrid },
      {
        to: "/admin/content",
        label: "الصفحة الرئيسية",
        icon: PanelsTopLeft,
        search: { tab: "home" },
        activeWhen: (p, s) => p.startsWith("/admin/content") && (s.includes("home") || s === ""),
      },
      {
        to: "/admin/content",
        label: "صفحة من نحن",
        icon: Info,
        search: { tab: "about" },
        activeWhen: (p, s) => p.startsWith("/admin/content") && s.includes("about"),
      },
      {
        to: "/admin/content",
        label: "الهوية والتواصل",
        icon: Fingerprint,
        search: { tab: "brand" },
        activeWhen: (p, s) => p.startsWith("/admin/content") && s.includes("brand"),
      },
    ],
  },
];

export function AdminSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const searchStr = useRouterState({ select: (s) => s.location.searchStr ?? "" });
  const logout = useApp((s) => s.logout);
  const brand = useContent((s) => s.content.brand);
  const nav = useNavigate();
  const requestsPending = useApp((s) => s.requests.filter((r) => r.status === "pending").length);

  return (
    <aside className="w-72 shrink-0 bg-sidebar text-sidebar-foreground h-screen sticky top-0 self-start flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gold text-gold-foreground shadow-gold">
            <HandHelping className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-lg font-bold">{brand.name}</div>
            <div className="text-[10px] text-gold tracking-widest uppercase">Admin Panel</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-5 overflow-y-auto">
        {groups.map((group) => (
          <div key={group.title}>
            <div className="px-4 pb-2 text-[11px] font-semibold tracking-wider text-sidebar-foreground/40">
              {group.title}
            </div>
            <div className="space-y-1">
              {group.items.map((it) => {
                const active = it.activeWhen
                  ? it.activeWhen(path, searchStr)
                  : it.exact
                    ? path === it.to
                    : path.startsWith(it.to);
                return (
                  <Link
                    key={it.to + it.label}
                    to={it.to}
                    search={it.search as never}
                    className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                      active
                        ? "bg-gold text-gold-foreground shadow-gold"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    }`}
                  >
                    <it.icon className="h-4 w-4" />
                    <span className="flex-1">{it.label}</span>
                    {it.to === "/admin/requests" && requestsPending > 0 && (
                      <span className={`text-xs rounded-full px-2 py-0.5 font-bold ${active ? "bg-emerald-deep text-gold" : "bg-destructive text-destructive-foreground"}`}>
                        {requestsPending}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Link
          to="/admin/settings"
          className={`w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all ${
            path.startsWith("/admin/settings")
              ? "bg-gold text-gold-foreground shadow-gold font-medium"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          }`}
        >
          <Settings className="h-4 w-4" /> الإعدادات
        </Link>
        <button
          onClick={() => nav({ to: "/" })}
          className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent"
        >
          <Home className="h-4 w-4" /> الموقع الرئيسي
        </button>
        <button
          onClick={() => {
            logout();
            nav({ to: "/" });
          }}
          className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent"
        >
          <LogOut className="h-4 w-4" /> تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
