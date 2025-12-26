import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn, ROLE_PERMISSIONS } from '@/lib/utils';
import { 
  User, 
  Shield, 
  Bell, 
  Zap, 
  Monitor,
  Eye,
  Edit,
  Download,
  CheckCircle2,
  XCircle,
  Moon,
  RefreshCw
} from 'lucide-react';

export function SettingsPage() {
  const { user } = useAuthStore();
  const { isRealTimeEnabled, toggleRealTime, ordersViewMode, setOrdersViewMode } = useUIStore();

  if (!user) return null;

  const permissions = ROLE_PERMISSIONS[user.role];

  const permissionItems = [
    { key: 'canViewAllOrders', label: 'View All Orders', icon: Eye },
    { key: 'canEditOrders', label: 'Edit Orders', icon: Edit },
    { key: 'canViewAllRegions', label: 'View All Regions', icon: Monitor },
    { key: 'canExport', label: 'Export Data', icon: Download },
    { key: 'canResolveExceptions', label: 'Resolve Exceptions', icon: CheckCircle2 },
    { key: 'canManageUsers', label: 'Manage Users', icon: Shield },
  ] as const;

  const roleColors = {
    admin: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    ops: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
    viewer: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' },
  };

  return (
    <div>
      <Header 
        title="Settings" 
        subtitle="Manage your account and preferences"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Card */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center">
                <User className="w-8 h-8 text-slate-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-100">{user.name}</p>
                <p className="text-sm text-slate-400">{user.email}</p>
                <div className={cn(
                  'inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-sm font-medium border',
                  roleColors[user.role].bg,
                  roleColors[user.role].text,
                  roleColors[user.role].border
                )}>
                  <Shield size={14} />
                  {user.role.toUpperCase()}
                </div>
              </div>
            </div>

            {user.region && (
              <div className="p-3 rounded-lg bg-slate-800/30">
                <p className="text-xs text-slate-500 mb-1">Assigned Region</p>
                <p className="text-sm font-medium text-slate-200">{user.region}</p>
              </div>
            )}

            <div className="p-3 rounded-lg bg-slate-800/30">
              <p className="text-xs text-slate-500 mb-1">Member Since</p>
              <p className="text-sm font-medium text-slate-200">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </Card>

        {/* Permissions Card */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
            <span className="text-sm text-slate-400">Based on your role</span>
          </CardHeader>
          <div className="space-y-3">
            {permissionItems.map(({ key, label, icon: Icon }) => {
              const hasPermission = permissions[key];
              return (
                <div
                  key={key}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg',
                    hasPermission ? 'bg-emerald-500/5' : 'bg-slate-800/30'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn(
                      'w-5 h-5',
                      hasPermission ? 'text-emerald-400' : 'text-slate-600'
                    )} />
                    <span className={cn(
                      'text-sm',
                      hasPermission ? 'text-slate-200' : 'text-slate-500'
                    )}>
                      {label}
                    </span>
                  </div>
                  {hasPermission ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-slate-600" />
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Preferences Card */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {/* Real-time Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
              <div className="flex items-center gap-3">
                <Zap className={cn(
                  'w-5 h-5',
                  isRealTimeEnabled ? 'text-emerald-400' : 'text-slate-500'
                )} />
                <div>
                  <p className="text-sm text-slate-200">Real-time Updates</p>
                  <p className="text-xs text-slate-500">
                    Receive live order status updates
                  </p>
                </div>
              </div>
              <button
                onClick={toggleRealTime}
                className={cn(
                  'w-12 h-6 rounded-full transition-all duration-200 relative',
                  isRealTimeEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                )}
              >
                <div
                  className={cn(
                    'absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200',
                    isRealTimeEnabled ? 'left-7' : 'left-1'
                  )}
                />
              </button>
            </div>

            {/* View Mode */}
            <div className="p-3 rounded-lg bg-slate-800/30">
              <div className="flex items-center gap-3 mb-3">
                <Monitor className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-200">Orders View Mode</p>
                  <p className="text-xs text-slate-500">Choose your preferred layout</p>
                </div>
              </div>
              <div className="flex gap-2">
                {(['list', 'grid'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setOrdersViewMode(mode)}
                    className={cn(
                      'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
                      ordersViewMode === mode
                        ? 'bg-amber-500 text-slate-900'
                        : 'bg-slate-700 text-slate-400 hover:text-slate-200'
                    )}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme (placeholder) */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 opacity-60">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-200">Dark Mode</p>
                  <p className="text-xs text-slate-500">Always enabled</p>
                </div>
              </div>
              <div className="w-12 h-6 rounded-full bg-emerald-500 relative">
                <div className="absolute top-1 left-7 w-4 h-4 rounded-full bg-white" />
              </div>
            </div>
          </div>
        </Card>

        {/* System Info Card */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>System Info</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-slate-800/30">
                <p className="text-xs text-slate-500">Version</p>
                <p className="text-sm font-mono text-slate-200">1.0.0</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/30">
                <p className="text-xs text-slate-500">Environment</p>
                <p className="text-sm font-mono text-amber-400">Demo</p>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-3">
                <RefreshCw className="w-5 h-5 text-amber-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-400">Demo Mode Active</p>
                  <p className="text-xs text-slate-400 mt-1">
                    This is a demonstration application with simulated data. 
                    All orders and updates are mock data for testing purposes.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-800">
              <p>Built with React + TypeScript + Tailwind CSS</p>
              <p className="mt-1">Designed for high-performance logistics tracking</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

