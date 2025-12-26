import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';
import { X, CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: 'border-emerald-500/30 bg-emerald-500/10',
  error: 'border-red-500/30 bg-red-500/10',
  warning: 'border-amber-500/30 bg-amber-500/10',
  info: 'border-blue-500/30 bg-blue-500/10',
};

const iconStyles = {
  success: 'text-emerald-400',
  error: 'text-red-400',
  warning: 'text-amber-400',
  info: 'text-blue-400',
};

export function ToastContainer() {
  const { notifications, removeNotification } = useUIStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {notifications.map((notification, index) => {
        const Icon = icons[notification.type];
        return (
          <div
            key={notification.id}
            className={cn(
              'flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm',
              'animate-slide-in-right',
              styles[notification.type]
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', iconStyles[notification.type])} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-100">{notification.title}</p>
              {notification.message && (
                <p className="text-xs text-slate-400 mt-0.5 truncate">{notification.message}</p>
              )}
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

