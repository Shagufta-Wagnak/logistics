import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { REGIONS } from '@/lib/utils';
import type { UserRole } from '@/types';
import { Package, Shield, Users, Eye, MapPin } from 'lucide-react';

const roles: { value: UserRole; label: string; description: string; icon: React.ElementType; color: string }[] = [
  { 
    value: 'admin', 
    label: 'Administrator', 
    description: 'Full access to all features and regions',
    icon: Shield,
    color: 'from-amber-500 to-orange-600'
  },
  { 
    value: 'ops', 
    label: 'Operations Manager', 
    description: 'Manage orders within assigned region',
    icon: Users,
    color: 'from-blue-500 to-cyan-600'
  },
  { 
    value: 'viewer', 
    label: 'Viewer', 
    description: 'Read-only access to order data',
    icon: Eye,
    color: 'from-slate-500 to-slate-600'
  },
];

export function LoginPage() {
  const { isAuthenticated, login, isLoading } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = () => {
    if (selectedRole) {
      login(selectedRole, selectedRole === 'ops' ? selectedRegion : undefined);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] grid-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 mb-4 glow-amber">
            <Package className="w-10 h-10 text-slate-900" />
          </div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">LogiTrack</h1>
          <p className="text-slate-400 mt-2">Real-Time Order & Logistics Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#151d2e] rounded-2xl border border-slate-800/50 p-6 animate-slide-up stagger-1">
          <h2 className="text-xl font-semibold text-slate-100 mb-6">Select Your Role</h2>

          {/* Role Selection */}
          <div className="space-y-3 mb-6">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.value;
              return (
                <button
                  key={role.value}
                  onClick={() => setSelectedRole(role.value)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className={`font-semibold ${isSelected ? 'text-amber-400' : 'text-slate-200'}`}>
                        {role.label}
                      </p>
                      <p className="text-sm text-slate-400 mt-0.5">{role.description}</p>
                    </div>
                    {isSelected && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Region Selection (for Ops role) */}
          {selectedRole === 'ops' && (
            <div className="mb-6 animate-fade-in">
              <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                <MapPin size={16} />
                Select Your Region
              </label>
              <Select
                options={REGIONS.map((r) => ({ value: r, label: r }))}
                placeholder="Choose a region..."
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              />
            </div>
          )}

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            disabled={!selectedRole || (selectedRole === 'ops' && !selectedRegion)}
            isLoading={isLoading}
            className="w-full"
            size="lg"
          >
            Continue to Dashboard
          </Button>

        
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 animate-slide-up stagger-2">
          {[
            { label: '10K+ Orders', icon: '📦' },
            { label: 'Real-time Updates', icon: '⚡' },
            { label: 'Live Tracking', icon: '🗺️' },
          ].map((feature) => (
            <div
              key={feature.label}
              className="text-center p-3 rounded-lg bg-slate-800/30 border border-slate-700/30"
            >
              <div className="text-2xl mb-1">{feature.icon}</div>
              <p className="text-xs text-slate-400">{feature.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

