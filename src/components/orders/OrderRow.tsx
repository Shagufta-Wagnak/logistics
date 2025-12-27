import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { StatusBadge, PriorityBadge } from '@/components/ui/StatusBadge';
import { MiniTimeline } from './OrderTimeline';
import type { Order } from '@/types';
import { ChevronRight, MapPin } from 'lucide-react';

interface OrderRowProps {
  order: Order;
  style?: React.CSSProperties;
  isSelected?: boolean;
  onSelect?: (orderId: string) => void;
}

export const OrderRow = memo(function OrderRow({ 
  order, 
  style, 
  isSelected,
  onSelect 
}: OrderRowProps) {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    if (onSelect) {
      onSelect(order.id);
    }
    navigate(`/orders/${order.id}`);
  }, [navigate, order.id, onSelect]);

  return (
    <div
      style={style}
      onClick={handleClick}
      className={cn(
        'flex items-center gap-4 px-4 py-3 cursor-pointer transition-all duration-200',
        'border-b border-slate-800/30',
        'hover:bg-slate-800/30',
        isSelected && 'bg-amber-500/10 border-l-2 border-l-amber-500'
      )}
    >
      <div className="w-[200px] flex-shrink-0">
        <p className="text-sm font-mono text-amber-400 truncate">{order.orderNumber}</p>
        <p className="text-sm text-slate-300 truncate">{order.customerName}</p>
      </div>

      <div className="w-[140px] flex-shrink-0">
        <StatusBadge status={order.status} size="sm" />
      </div>

      <div className="w-[100px] flex-shrink-0">
        <MiniTimeline status={order.status} />
      </div>

      <div className="w-[80px] flex-shrink-0">
        <PriorityBadge priority={order.priority} size="sm" />
      </div>

      <div className="w-[100px] flex-shrink-0 text-right">
        <p className="text-sm font-medium text-slate-200">
          {formatCurrency(order.totalAmount, order.currency)}
        </p>
      </div>

      <div className="w-[100px] flex-shrink-0">
        <div className="flex items-center gap-1 text-sm text-slate-400">
          <MapPin size={14} />
          <span className="truncate">{order.region}</span>
        </div>
      </div>

      <div className="flex-1 min-w-[120px]">
        <p className="text-sm text-slate-400">{formatDate(order.createdAt)}</p>
        <p className="text-xs text-slate-500">{formatDate(order.createdAt, 'time')}</p>
      </div>

      <div className="w-8 flex-shrink-0 flex justify-end">
        <ChevronRight className="w-5 h-5 text-slate-600" />
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for optimal memoization
  return (
    prevProps.order.id === nextProps.order.id &&
    prevProps.order.status === nextProps.order.status &&
    prevProps.order.updatedAt === nextProps.order.updatedAt &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.style?.top === nextProps.style?.top
  );
});

// Header row for the order list
export function OrderListHeader() {
  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-slate-800/30 border-b border-slate-700/50 sticky top-0 z-10">
      <div className="w-[200px] flex-shrink-0 text-xs font-medium text-slate-500 uppercase tracking-wider">
        Order / Customer
      </div>
      <div className="w-[140px] flex-shrink-0 text-xs font-medium text-slate-500 uppercase tracking-wider">
        Status
      </div>
      <div className="w-[100px] flex-shrink-0 text-xs font-medium text-slate-500 uppercase tracking-wider">
        Progress
      </div>
      <div className="w-[80px] flex-shrink-0 text-xs font-medium text-slate-500 uppercase tracking-wider">
        Priority
      </div>
      <div className="w-[100px] flex-shrink-0 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">
        Amount
      </div>
      <div className="w-[100px] flex-shrink-0 text-xs font-medium text-slate-500 uppercase tracking-wider">
        Region
      </div>
      <div className="flex-1 min-w-[120px] text-xs font-medium text-slate-500 uppercase tracking-wider">
        Created
      </div>
      <div className="w-8 flex-shrink-0" />
    </div>
  );
}


