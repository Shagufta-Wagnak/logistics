import { useUIStore } from '@/stores/uiStore';
import { formatDate } from '@/lib/utils';
import { Activity, RefreshCw } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  const { lastUpdateTime, isRealTimeEnabled } = useUIStore();

  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
      </div>
      
      <div className="flex items-center gap-4">
        {/* Real-time indicator */}
        {isRealTimeEnabled && (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            {lastUpdateTime && (
              <span>Last update: {formatDate(lastUpdateTime, 'time')}</span>
            )}
          </div>
        )}
        
        {actions}
      </div>
    </header>
  );
}

interface RefreshButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

export function RefreshButton({ onClick, isLoading }: RefreshButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-all disabled:opacity-50"
    >
      <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
    </button>
  );
}


