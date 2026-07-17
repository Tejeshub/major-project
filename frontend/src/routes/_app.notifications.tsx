import { createFileRoute } from "@tanstack/react-router";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/hooks/useNotifications";
import { Bell, Check, Clock, Info, AlertTriangle, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_app/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  const { data: notifications = [], isLoading, isError } = useNotifications();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: isMarkingAll } = useMarkAllNotificationsRead();

  if (isLoading) {
    return <div className="p-8 text-center animate-pulse text-ink/60">Loading notifications...</div>;
  }

  if (isError) {
    return (
      <div className="card-warm p-8 text-center text-destructive flex flex-col items-center gap-3 max-w-xl mx-auto mt-12">
        <AlertCircle className="w-8 h-8" />
        <p>Failed to load notifications. Please try again.</p>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch(type) {
      case "reminder": return <Clock className="w-5 h-5 text-rust" />;
      case "detection": return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display flex items-center gap-2">
          <Bell className="w-6 h-6 text-rust" /> Notifications
        </h1>
        {unreadCount > 0 && (
          <button 
            onClick={() => markAllRead()} 
            disabled={isMarkingAll}
            className="btn-ghost-border !py-1.5 !px-3 text-sm flex items-center gap-2 disabled:opacity-50"
          >
            <Check className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card-warm p-12 text-center text-ink/60">
          You don't have any notifications yet.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <div 
              key={n.id} 
              className={`card-warm p-4 flex gap-4 transition-all duration-300 ${!n.isRead ? 'ring-2 ring-rust/20 bg-background/50' : ''}`}
            >
              <div className="mt-1">
                {getIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1 gap-4">
                  <h3 className={`font-semibold text-lg ${!n.isRead ? 'text-rust' : ''}`}>{n.title}</h3>
                  <span className="text-xs text-ink/50 whitespace-nowrap">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-ink/80 text-sm">{n.message}</p>
                
                {n.actionUrl && (
                  <div className="mt-3">
                    <a href={n.actionUrl} className="text-sm font-medium text-rust hover:underline">
                      View details &rarr;
                    </a>
                  </div>
                )}
              </div>
              {!n.isRead && (
                <button 
                  onClick={() => markRead(n.id)}
                  className="self-center p-2 hover:bg-secondary rounded-full transition group"
                  aria-label="Mark as read"
                  title="Mark as read"
                >
                  <Check className="w-5 h-5 text-rust/50 group-hover:text-rust" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
