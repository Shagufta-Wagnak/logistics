import { useState } from 'react';
import { useExceptions } from '@/hooks/useExceptions';
import { useAuthStore } from '@/stores/authStore';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PageLoader } from '@/components/ui/Spinner';
import { cn, formatDate } from '@/lib/utils';
import type { OrderException, ExceptionType } from '@/types';
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Package, 
  UserX, 
  Home,
  AlertOctagon,
  CheckCircle2,
  X,
  Filter
} from 'lucide-react';

const exceptionConfig: Record<ExceptionType, { 
  label: string; 
  icon: React.ElementType; 
  color: string;
  bgColor: string;
}> = {
  delayed_delivery: { 
    label: 'Delayed Delivery', 
    icon: Clock, 
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/10'
  },
  failed_delivery: { 
    label: 'Failed Delivery', 
    icon: AlertTriangle, 
    color: 'text-red-400',
    bgColor: 'bg-red-400/10'
  },
  missing_location: { 
    label: 'Missing Location', 
    icon: MapPin, 
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10'
  },
  customer_unavailable: { 
    label: 'Customer Unavailable', 
    icon: UserX, 
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10'
  },
  address_issue: { 
    label: 'Address Issue', 
    icon: Home, 
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10'
  },
  package_damaged: { 
    label: 'Package Damaged', 
    icon: Package, 
    color: 'text-red-400',
    bgColor: 'bg-red-400/10'
  },
};

const severityColors = {
  low: 'border-l-slate-500',
  medium: 'border-l-amber-500',
  high: 'border-l-orange-500',
  critical: 'border-l-red-500',
};

interface ExceptionCardProps {
  exception: OrderException;
  onResolve: (id: string, resolution: string) => void;
  canResolve: boolean;
}

function ExceptionCard({ exception, onResolve, canResolve }: ExceptionCardProps) {
  const [showResolve, setShowResolve] = useState(false);
  const [resolution, setResolution] = useState('');
  
  const config = exceptionConfig[exception.type];
  const Icon = config.icon;
  const isResolved = !!exception.resolvedAt;

  const handleResolve = () => {
    if (resolution.trim()) {
      onResolve(exception.id, resolution);
      setShowResolve(false);
      setResolution('');
    }
  };

  return (
    <div
      className={cn(
        'bg-slate-800/30 rounded-lg border-l-4 p-4 transition-all',
        severityColors[exception.severity],
        isResolved && 'opacity-60'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={cn('p-2 rounded-lg', config.bgColor)}>
            <Icon className={cn('w-5 h-5', config.color)} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={cn('font-medium', config.color)}>{config.label}</span>
              <span className={cn(
                'text-xs px-2 py-0.5 rounded-full uppercase font-medium',
                exception.severity === 'critical' && 'bg-red-500/20 text-red-400',
                exception.severity === 'high' && 'bg-orange-500/20 text-orange-400',
                exception.severity === 'medium' && 'bg-amber-500/20 text-amber-400',
                exception.severity === 'low' && 'bg-slate-500/20 text-slate-400',
              )}>
                {exception.severity}
              </span>
              {isResolved && (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <CheckCircle2 size={12} />
                  Resolved
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400 mt-1">{exception.description}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
              <span>Order: <span className="text-amber-400 font-mono">{exception.orderId.slice(0, 12)}...</span></span>
              <span>{formatDate(exception.createdAt, 'long')}</span>
            </div>
          </div>
        </div>
        
        {canResolve && !isResolved && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowResolve(!showResolve)}
          >
            {showResolve ? <X size={14} /> : 'Resolve'}
          </Button>
        )}
      </div>
      
      {showResolve && (
        <div className="mt-4 pt-4 border-t border-slate-700/50 animate-fade-in">
          <label className="text-sm text-slate-400 mb-2 block">Resolution Notes</label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter resolution details..."
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleResolve} disabled={!resolution.trim()}>
              Submit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ExceptionsPage() {
  const { exceptions, isLoading, resolveException } = useExceptions();
  const { hasPermission } = useAuthStore();
  const [typeFilter, setTypeFilter] = useState<ExceptionType | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [showResolved, setShowResolved] = useState(false);

  const canResolve = hasPermission('canResolveExceptions');

  const filteredExceptions = exceptions.filter((e) => {
    if (!showResolved && e.resolvedAt) return false;
    if (typeFilter !== 'all' && e.type !== typeFilter) return false;
    if (severityFilter !== 'all' && e.severity !== severityFilter) return false;
    return true;
  });

  const stats = {
    total: exceptions.length,
    critical: exceptions.filter(e => e.severity === 'critical' && !e.resolvedAt).length,
    unresolved: exceptions.filter(e => !e.resolvedAt).length,
    resolved: exceptions.filter(e => e.resolvedAt).length,
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div>
      <Header 
        title="Exceptions & Failures" 
        subtitle={`${stats.unresolved} unresolved issues require attention`}
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Issues', value: stats.total, color: 'text-slate-300' },
          { label: 'Critical', value: stats.critical, color: 'text-red-400' },
          { label: 'Unresolved', value: stats.unresolved, color: 'text-amber-400' },
          { label: 'Resolved', value: stats.resolved, color: 'text-emerald-400' },
        ].map((stat) => (
          <Card key={stat.label} variant="bordered" padding="sm">
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className={cn('text-2xl font-bold mt-1', stat.color)}>{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Filter size={16} />
          Filters:
        </div>
        
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as ExceptionType | 'all')}
          className="h-9 px-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        >
          <option value="all">All Types</option>
          {(Object.keys(exceptionConfig) as ExceptionType[]).map((type) => (
            <option key={type} value={type}>{exceptionConfig[type].label}</option>
          ))}
        </select>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="h-9 px-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            checked={showResolved}
            onChange={(e) => setShowResolved(e.target.checked)}
            className="w-4 h-4 rounded bg-slate-800 border-slate-600 text-amber-500 focus:ring-amber-500/50"
          />
          Show Resolved
        </label>

        <span className="text-sm text-slate-500 ml-auto">
          {filteredExceptions.length} of {exceptions.length} exceptions
        </span>
      </div>

      {/* Exceptions List */}
      {filteredExceptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
          <AlertOctagon className="w-12 h-12 text-slate-600 mb-4" />
          <p className="text-lg font-medium">No exceptions found</p>
          <p className="text-sm mt-1">Adjust filters to see more results</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredExceptions.map((exception) => (
            <ExceptionCard
              key={exception.id}
              exception={exception}
              onResolve={resolveException}
              canResolve={canResolve}
            />
          ))}
        </div>
      )}
    </div>
  );
}


