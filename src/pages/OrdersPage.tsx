import { useOrders } from '@/hooks/useOrders';
import { Header, RefreshButton } from '@/components/layout/Header';
import { OrderFilters } from '@/components/orders/OrderFilters';
import { VirtualizedOrderList } from '@/components/orders/VirtualizedOrderList';
import { useOrdersStore } from '@/stores/ordersStore';

export function OrdersPage() {
  const { 
    orders, 
    stats,
    isLoading, 
    filters, 
    setFilters, 
    clearFilters,
    refetch 
  } = useOrders();
  
  const { selectedOrderId, setSelectedOrder } = useOrdersStore();

  return (
    <div>
      <Header 
        title="Orders" 
        subtitle={`Managing ${stats.total.toLocaleString()} orders across all regions`}
        actions={
          <RefreshButton onClick={() => refetch()} isLoading={isLoading} />
        }
      />

      <OrderFilters
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={clearFilters}
        orderCount={orders.length}
        totalCount={stats.total}
      />

      <VirtualizedOrderList
        orders={orders}
        isLoading={isLoading}
        selectedOrderId={selectedOrderId}
        onSelectOrder={setSelectedOrder}
      />
    </div>
  );
}

