import { memo } from 'react';
import { cn, STATUS_CONFIG, PRIORITY_CONFIG } from '@/lib/utils';
import type { OrderStatus, OrderPriority } from '@/types';
import { 
  Package, 
  PackageCheck, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const StatusIcons: Record<OrderStatus, React.ElementType> = {
  created: Package,
  packed: PackageCheck,
  shipped: Truck,
  out_for_delivery: MapPin,
  delivered: CheckCircle2,
  failed: XCircle,
};

export const StatusBadge = memo(function StatusBadge({ 
  status, 
  size = 'md',
  showIcon = true 
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = StatusIcons[status];
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3 py-1.5 gap-2',
  };
  
  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        config.bgColor,
        config.color,
        'border-current/20',
        sizeClasses[size]
      )}
    >
      {showIcon && <Icon size={iconSizes[size]} />}
      {config.label}
    </span>
  );
});

interface PriorityBadgeProps {
  priority: OrderPriority;
  size?: 'sm' | 'md' | 'lg';
}

export const PriorityBadge = memo(function PriorityBadge({ 
  priority, 
  size = 'md' 
}: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded border',
        config.bgColor,
        config.color,
        'border-current/20',
        sizeClasses[size]
      )}
    >
      {config.label}
    </span>
  );
});


