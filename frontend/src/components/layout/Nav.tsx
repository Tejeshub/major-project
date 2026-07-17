import { Link, useRouterState } from "@tanstack/react-router";
import { Logo } from "@/components/ui-brand/Logo";
import { useApp } from "@/stores/app";
import { ShoppingBag, Sprout, Users, User, Map as MapIcon, Bell, Check, Clock } from "lucide-react";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/hooks/useNotifications";
import { useState, useRef, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

const TOP_LINKS = [
  { to: "/dashboard", label: "Plants" },
  { to: "/community", label: "Community" },
  { to: "/market", label: "Market" },
  { to: "/learn", label: "Learn" },
  { to: "/experts", label: "Experts" },
];

export function TopNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const user = useApp((s) => s.user);
  const cart = useApp((s) => s.cart);
  const cartCount = cart.reduce((a, c) => a + c.qty, 0);

  const { data: notifications = [] } = useNotifications();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead } = useMarkAllNotificationsRead();
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotif(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-8">
          {TOP_LINKS.map((l) => {
            const active = pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm font-medium transition-colors ${active ? "text-rust" : "text-ink/70 hover:text-ink"}`}
              >
                {l.label}
                {active && <span className="block h-0.5 w-1.5 bg-rust rounded-full mx-auto mt-1" />}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          {user && (
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setShowNotif(!showNotif)}
                className="relative p-2 rounded-full hover:bg-secondary transition" 
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-ink" />
                {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-rust text-[10px] text-white rounded-full w-4 h-4 flex items-center justify-center">{unreadCount > 9 ? '9+' : unreadCount}</span>}
              </button>
              
              {showNotif && (
                <div className="absolute right-0 mt-2 w-80 bg-background border border-border shadow-lg rounded-xl overflow-hidden flex flex-col z-50">
                  <div className="p-3 border-b border-border flex items-center justify-between bg-secondary/30">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                    <div className="flex gap-2">
                      {unreadCount > 0 && (
                        <button onClick={() => markAllRead()} className="text-xs text-ink/70 hover:text-rust transition flex items-center gap-1">
                          <Check className="w-3 h-3" /> Mark all read
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-sm text-ink/60">No notifications yet.</div>
                    ) : (
                      <div className="divide-y divide-border/50">
                        {notifications.slice(0, 5).map(n => (
                          <div key={n.id} className={`p-3 transition hover:bg-secondary/20 flex gap-3 ${!n.isRead ? 'bg-rust/5' : ''}`}>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm mb-0.5 truncate ${!n.isRead ? 'font-medium' : 'text-ink/80'}`}>{n.title}</p>
                              <p className="text-xs text-ink/60 line-clamp-2">{n.message}</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[10px] text-ink/50 flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                </span>
                              </div>
                            </div>
                            {!n.isRead && (
                              <button 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); markRead(n.id); }}
                                className="w-2 h-2 rounded-full bg-rust mt-1.5"
                                aria-label="Mark as read"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Link to="/notifications" onClick={() => setShowNotif(false)} className="p-2.5 text-center text-xs font-medium bg-secondary/50 hover:bg-secondary transition border-t border-border block">
                    View all notifications
                  </Link>
                </div>
              )}
            </div>
          )}
          {user && (
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-secondary transition" aria-label="Cart">
              <ShoppingBag className="w-5 h-5 text-ink" />
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-rust text-[10px] text-white rounded-full w-4 h-4 flex items-center justify-center">{cartCount}</span>}
            </Link>
          )}
          {user ? (
            <Link to="/profile" className="flex items-center gap-2">
              <img src={user.avatar} alt="" className="w-9 h-9 rounded-full bg-secondary" />
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm text-ink/80 hover:text-ink hidden md:inline">Sign in</Link>
              <Link to="/login" className="btn-rust !py-2 !px-4 text-sm">Get started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

const TABS = [
  { to: "/dashboard", label: "Plants", icon: Sprout, match: ["/dashboard", "/plants", "/detect", "/reminders"] },
  { to: "/community", label: "Community", icon: Users, match: ["/community"] },
  { to: "/market", label: "Market", icon: ShoppingBag, match: ["/market", "/cart", "/checkout", "/orders"] },
  { to: "/profile", label: "You", icon: User, match: ["/profile", "/subscription", "/seller", "/consultations", "/experts"] },
];

export function MobileTabs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-border/60 pb-[env(safe-area-inset-bottom)]">
      <div className="flex">
        {TABS.map(({ to, label, icon: Icon, match }) => {
          const active = match.some((m) => pathname.startsWith(m));
          return (
            <Link key={to} to={to} className="flex-1 py-2.5 flex flex-col items-center gap-0.5 transition-colors">
              <Icon className={`w-5 h-5 ${active ? "text-rust" : "text-ink/55"}`} />
              <span className={`text-[10px] font-medium ${active ? "text-rust" : "text-ink/55"}`}>{label}</span>
              {active && <span className="block h-1 w-1 bg-rust rounded-full" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function MobileTitleBar({ title }: { title: string }) {
  return (
    <div className="md:hidden sticky top-0 z-30 bg-background/90 backdrop-blur border-b border-border/60 px-4 h-14 flex items-center">
      <h1 className="font-display text-lg">{title}</h1>
    </div>
  );
}
