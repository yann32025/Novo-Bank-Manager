import { useState } from "react";
import { Bell } from "lucide-react";
import { useNotifications, useMarkNotificationsRead } from "@/hooks/use-banking";
import { motion, AnimatePresence } from "framer-motion";

export function NotificationBell() {
  const { data: notifications } = useNotifications();
  const markRead = useMarkNotificationsRead();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      markRead.mutate();
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={handleOpen}
        className="relative p-2 rounded-full hover:bg-secondary transition-colors text-foreground"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-3 h-3 bg-destructive rounded-full border-2 border-background animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 bg-card rounded-2xl shadow-xl shadow-black/10 border border-border/50 z-50 overflow-hidden"
            >
              <div className="p-4 bg-secondary/50 border-b border-border/50">
                <h3 className="font-display font-semibold text-foreground">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto no-scrollbar">
                {!notifications?.length ? (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    Aucune notification
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-4 border-b border-border/30 last:border-0 transition-colors ${!n.isRead ? 'bg-primary/5' : ''}`}
                    >
                      <p className="text-sm text-foreground">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
