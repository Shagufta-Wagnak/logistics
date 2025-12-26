import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import {
  LayoutDashboard,
  Package,
  Map,
  AlertTriangle,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
  User,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/orders', icon: Package, label: 'Orders' },
  { path: '/tracking', icon: Map, label: 'Live Tracking' },
  { path: '/exceptions', icon: AlertTriangle, label: 'Exceptions' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar, isRealTimeEnabled, toggleRealTime } = useUIStore();

  const roleColors = {
    admin: 'text-amber-400 bg-amber-400/10',
    ops: 'text-blue-400 bg-blue-400/10',
    viewer: 'text-slate-400 bg-slate-400/10',
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-[#0d1117] border-r border-slate-800/50',
        'flex flex-col transition-all duration-300 z-40',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/50">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Package className="w-5 h-5 text-slate-900" />
            </div>
            <span className="font-bold text-slate-100 tracking-tight">LogiTrack</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors"
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* User Info */}
      {user && (
        <div className={cn('px-3 py-4 border-b border-slate-800/50', sidebarCollapsed && 'px-2')}>
          <div className={cn('flex items-center gap-3', sidebarCollapsed && 'justify-center')}>
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-slate-400" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{user.name}</p>
                <span className={cn('text-xs px-2 py-0.5 rounded-full', roleColors[user.role])}>
                  {user.role.toUpperCase()}
                </span>
              </div>
            )}
          </div>
          {!sidebarCollapsed && user.region && (
            <p className="text-xs text-slate-500 mt-2 pl-[52px]">Region: {user.region}</p>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                'group relative',
                isActive
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50',
                sidebarCollapsed && 'justify-center px-2'
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-amber-500 rounded-r-full" />
              )}
              <item.icon size={20} />
              {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-slate-200 text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-slate-800/50 space-y-2">
        {/* Real-time toggle */}
        <button
          onClick={toggleRealTime}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
            isRealTimeEnabled
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-slate-800/50 text-slate-500',
            sidebarCollapsed && 'justify-center px-2'
          )}
        >
          <Zap size={20} className={isRealTimeEnabled ? 'animate-pulse' : ''} />
          {!sidebarCollapsed && (
            <span className="font-medium text-sm">
              {isRealTimeEnabled ? 'Live Updates ON' : 'Live Updates OFF'}
            </span>
          )}
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
            'text-slate-400 hover:text-red-400 hover:bg-red-500/10',
            sidebarCollapsed && 'justify-center px-2'
          )}
        >
          <LogOut size={20} />
          {!sidebarCollapsed && <span className="font-medium text-sm">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}

