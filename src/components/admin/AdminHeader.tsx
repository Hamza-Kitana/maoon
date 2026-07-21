import { Bell, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useApp } from "@/store/app";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export function AdminHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const notifs = useApp((s) => s.notifications);
  const markAllRead = useApp((s) => s.markAllRead);
  const markNotifRead = useApp((s) => s.markNotifRead);
  const user = useApp((s) => s.currentUser());
  const unread = notifs.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between px-8 py-5">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-bold truncate">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground truncate">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <button className="relative grid h-11 w-11 place-items-center rounded-xl border border-border hover:bg-muted transition-colors">
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 grid place-items-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">
                    {unread}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-96 p-0">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="font-semibold">الإشعارات</div>
                {unread > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllRead}>
                    <Check className="h-3 w-3" /> قراءة الكل
                  </Button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifs.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">لا توجد إشعارات</div>
                ) : (
                  notifs.slice(0, 20).map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markNotifRead(n.id)}
                      className={`w-full text-right p-4 border-b hover:bg-muted transition-colors ${!n.read ? "bg-gold/5" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        {!n.read && <span className="mt-1.5 h-2 w-2 rounded-full bg-gold shrink-0" />}
                        <div className="min-w-0 flex-1">
                          <div className="text-sm">{n.message}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(n.createdAt, { addSuffix: true, locale: ar })}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>
          {user && (
            <div className="flex items-center gap-3 pr-3 border-r border-border">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-emerald-deep grid place-items-center text-primary-foreground font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="hidden md:block min-w-0">
                <div className="text-sm font-semibold truncate">{user.name}</div>
                <div className="text-xs text-muted-foreground">مشرف</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
