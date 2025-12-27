import { memo, useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { OrderRow, OrderListHeader } from './OrderRow';
import { PageLoader } from '@/components/ui/Spinner';
import type { Order } from '@/types';

interface VirtualizedOrderListProps {
  orders: Order[];
  isLoading: boolean;
  selectedOrderId?: string | null;
  onSelectOrder?: (orderId: string) => void;
}

export const VirtualizedOrderList = memo(function VirtualizedOrderList({
  orders,
  isLoading,
  selectedOrderId,
  onSelectOrder,
}: VirtualizedOrderListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: orders.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64, 
    overscan: 20, 
  });

  const handleSelectOrder = useCallback((orderId: string) => {
    onSelectOrder?.(orderId);
  }, [onSelectOrder]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <p className="text-lg font-medium">No orders found</p>
        <p className="text-sm mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="bg-[#151d2e] rounded-xl border border-slate-800/50 overflow-hidden">
      <OrderListHeader />
      <div
        ref={parentRef}
        className="h-[calc(100vh-280px)] overflow-auto"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const order = orders[virtualRow.index];
            return (
              <OrderRow
                key={order.id}
                order={order}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                isSelected={selectedOrderId === order.id}
                onSelect={handleSelectOrder}
              />
            );
          })}
        </div>
      </div>
      
    
    </div>
  );
});


