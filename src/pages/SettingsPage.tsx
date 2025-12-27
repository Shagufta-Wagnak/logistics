import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn, ROLE_PERMISSIONS } from '@/lib/utils';
import type { UserRole } from '@/types';
import { 
  User, 
  Shield, 
  Zap, 
  Monitor,
  Eye,
  Edit,
  Download,
  CheckCircle2,
  XCircle,
  Users,
  AlertTriangle,
} from 'lucide-react';

const permissionItems = [
  { key: 'canViewAllOrders', label: 'View All Orders', icon: Eye, description: 'Access orders from all regions' },
  { key: 'canEditOrders', label: 'Edit Orders', icon: Edit, description: 'Modify order status and details' },
  { key: 'canViewAllRegions', label: 'View All Regions', icon: Monitor, description: 'See data across all regions' },
  { key: 'canExport', label: 'Export Data', icon: Download, description: 'Download orders as CSV' },
  { key: 'canResolveExceptions', label: 'Resolve Exceptions', icon: AlertTriangle, description: 'Handle delivery failures' },
  { key: 'canManageUsers', label: 'View Permissions', icon: Shield, description: 'View role permissions' },
] as const;

const roles: { value: UserRole; label: string; color: string; description: string }[] = [
  { value: 'admin', label: 'Administrator', color: 'amber', description: 'Full system access' },
  { value: 'ops', label: 'Operations', color: 'blue', description: 'Regional management' },
  { value: 'viewer', label: 'Viewer', color: 'slate', description: 'Read-only access' },
];

export function SettingsPage() {
  const { user, hasPermission } = useAuthStore();
  const { isRealTimeEnabled, toggleRealTime } = useUIStore();
  
  const canManagePermissions = hasPermission('canManageUsers');

  if (!user) return null;

  const permissions = ROLE_PERMISSIONS[user.role];

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
          <div className="space-y-4 mt-2">
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
          </div>
        </Card>

        {/* Your Permissions Card */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Your Permissions</CardTitle>
            <span className="text-sm text-slate-400">Based on your role</span>
          </CardHeader>
          <div className="space-y-3">
            {permissionItems.map(({ key, label, icon: Icon }) => {
              const hasPermissionForKey = permissions[key];
              return (
                <div
                  key={key}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg',
                    hasPermissionForKey ? 'bg-emerald-500/5' : 'bg-slate-800/30'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn(
                      'w-5 h-5',
                      hasPermissionForKey ? 'text-emerald-400' : 'text-slate-600'
                    )} />
                    <span className={cn(
                      'text-sm',
                      hasPermissionForKey ? 'text-slate-200' : 'text-slate-500'
                    )}>
                      {label}
                    </span>
                  </div>
                  {hasPermissionForKey ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-slate-600" />
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Role Permissions Matrix - Only for Admins */}
        {canManagePermissions && (
          <Card variant="bordered" className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <CardTitle>Role Permissions Matrix</CardTitle>
              </div>
              <span className="text-sm text-slate-400">Compare permissions across all roles</span>
            </CardHeader>

            {/* Permissions Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Permission
                    </th>
                    {roles.map((role) => (
                      <th key={role.value} className="text-center py-3 px-4">
                        <div className={cn(
                          'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
                          `bg-${role.color}-500/10 text-${role.color}-400 border border-${role.color}-500/30`
                        )}>
                          <Shield size={12} />
                          {role.label}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{role.description}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {permissionItems.map(({ key, label, icon: Icon, description }) => (
                    <tr key={key} className="border-b border-slate-800/30 hover:bg-slate-800/20">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-sm text-slate-200">{label}</p>
                            <p className="text-xs text-slate-500">{description}</p>
                          </div>
                        </div>
                      </td>
                      {roles.map((role) => {
                        const rolePerms = ROLE_PERMISSIONS[role.value];
                        const hasIt = rolePerms[key];
                        return (
                          <td key={role.value} className="text-center py-4 px-4">
                            {hasIt ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                            ) : (
                              <XCircle className="w-5 h-5 text-slate-600 mx-auto" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Role Summary */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {roles.map((role) => {
                const rolePerms = ROLE_PERMISSIONS[role.value];
                const permCount = Object.values(rolePerms).filter(Boolean).length;
                const totalPerms = Object.keys(rolePerms).length;
                
                return (
                  <div
                    key={role.value}
                    className={cn(
                      'p-4 rounded-lg border',
                      role.value === user.role ? 'border-amber-500/50 bg-amber-500/5' : 'border-slate-700/50 bg-slate-800/30'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={cn(
                        'text-sm font-medium',
                        role.value === 'admin' && 'text-amber-400',
                        role.value === 'ops' && 'text-blue-400',
                        role.value === 'viewer' && 'text-slate-400'
                      )}>
                        {role.label}
                      </span>
                      {role.value === user.role && (
                        <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mb-3">{role.description}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            'h-full rounded-full',
                            role.value === 'admin' && 'bg-amber-500',
                            role.value === 'ops' && 'bg-blue-500',
                            role.value === 'viewer' && 'bg-slate-500'
                          )}
                          style={{ width: `${(permCount / totalPerms) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400">
                        {permCount}/{totalPerms}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
