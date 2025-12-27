import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { OrderStatus, OrderPriority, UserRole } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bgColor: string }> = {
  created: { label: 'Created', color: 'text-slate-400', bgColor: 'bg-slate-400/15' },
  packed: { label: 'Packed', color: 'text-blue-400', bgColor: 'bg-blue-400/15' },
  shipped: { label: 'Shipped', color: 'text-violet-400', bgColor: 'bg-violet-400/15' },
  out_for_delivery: { label: 'Out for Delivery', color: 'text-amber-400', bgColor: 'bg-amber-400/15' },
  delivered: { label: 'Delivered', color: 'text-emerald-400', bgColor: 'bg-emerald-400/15' },
  failed: { label: 'Failed', color: 'text-red-400', bgColor: 'bg-red-400/15' },
};

export const PRIORITY_CONFIG: Record<OrderPriority, { label: string; color: string; bgColor: string }> = {
  low: { label: 'Low', color: 'text-slate-400', bgColor: 'bg-slate-400/15' },
  normal: { label: 'Normal', color: 'text-blue-400', bgColor: 'bg-blue-400/15' },
  high: { label: 'High', color: 'text-amber-400', bgColor: 'bg-amber-400/15' },
  urgent: { label: 'Urgent', color: 'text-red-400', bgColor: 'bg-red-400/15' },
};

export const ROLE_PERMISSIONS: Record<UserRole, {
  canViewAllOrders: boolean;
  canEditOrders: boolean;
  canManageUsers: boolean;
  canViewAllRegions: boolean;
  canExport: boolean;
  canResolveExceptions: boolean;
}> = {
  admin: {
    canViewAllOrders: true,
    canEditOrders: true,
    canManageUsers: true,
    canViewAllRegions: true,
    canExport: true,
    canResolveExceptions: true,
  },
  ops: {
    canViewAllOrders: false,
    canEditOrders: true,
    canManageUsers: false,
    canViewAllRegions: false,
    canExport: true,
    canResolveExceptions: true,
  },
  viewer: {
    canViewAllOrders: false,
    canEditOrders: false,
    canManageUsers: false,
    canViewAllRegions: false,
    canExport: false,
    canResolveExceptions: false,
  },
};

export const REGIONS = [
  'Northeast',
  'Southeast',
  'Central',
  'South',
  'Southwest',
  'West',
  'Northwest',
];

export const ORDER_STATUSES: OrderStatus[] = [
  'created',
  'packed',
  'shipped',
  'out_for_delivery',
  'delivered',
  'failed',
];

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(date: string | Date, format: 'short' | 'long' | 'time' = 'short'): string {
  const d = new Date(date);
  
  switch (format) {
    case 'long':
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    case 'time':
      return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    default:
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
  }
}

export function generateOrderNumber(): string {
  const prefix = 'ORD';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function generateTrackingNumber(): string {
  const prefix = 'TRK';
  const segments = Array.from({ length: 3 }, () =>
    Math.random().toString(36).substring(2, 6).toUpperCase()
  );
  return `${prefix}${segments.join('')}`;
}

export function getStatusIndex(status: OrderStatus): number {
  const order: OrderStatus[] = ['created', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
  return order.indexOf(status);
}

export function getNextStatus(current: OrderStatus): OrderStatus | null {
  const flow: OrderStatus[] = ['created', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
  const currentIndex = flow.indexOf(current);
  if (currentIndex === -1 || currentIndex === flow.length - 1) return null;
  return flow[currentIndex + 1];
}

export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: never[]) => void>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}


