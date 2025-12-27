import { useCallback } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { useAuthStore } from '@/stores/authStore';
import { Header, RefreshButton } from '@/components/layout/Header';
import { OrderFilters } from '@/components/orders/OrderFilters';
import { VirtualizedOrderList } from '@/components/orders/VirtualizedOrderList';
import { useOrdersStore } from '@/stores/ordersStore';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { Download } from 'lucide-react';
import type { Order } from '@/types';

// Export orders to CSV
function exportOrdersToCSV(orders: Order[], filename: string = 'orders-export.csv') {
  const headers = [
    'Order Number',
    'Customer Name',
    'Email',
    'Phone',
    'Status',
    'Priority',
    'Total Amount',
    'Currency',
    'Region',
    'Shipping Address',
    'City',
    'State',
    'Zip Code',
    'Tracking Number',
    'Created At',
    'Updated At',
    'Items Count',
  ];

  const rows = orders.map(order => [
    order.orderNumber,
    order.customerName,
    order.customerEmail,
    order.customerPhone,
    order.status,
    order.priority,
    order.totalAmount.toFixed(2),
    order.currency,
    order.region,
    order.shippingAddress.street,
    order.shippingAddress.city,
    order.shippingAddress.state,
    order.shippingAddress.zipCode,
    order.trackingNumber || '',
    formatDate(order.createdAt, 'long'),
    formatDate(order.updatedAt, 'long'),
    order.items.length.toString(),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

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
  const { hasPermission } = useAuthStore();
  const { addNotification } = useUIStore();
  
  const canExport = hasPermission('canExport');

  const handleExport = useCallback(() => {
    if (orders.length === 0) {
      addNotification({
        type: 'warning',
        title: 'No data to export',
        message: 'Apply filters to get orders first',
      });
      return;
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `orders-export-${timestamp}.csv`;
    
    exportOrdersToCSV(orders, filename);
    
    addNotification({
      type: 'success',
      title: 'Export successful',
      message: `Exported ${orders.length.toLocaleString()} orders to ${filename}`,
    });
  }, [orders, addNotification]);

  return (
    <div>
      <Header 
        title="Orders" 
        subtitle={`Managing ${stats.total.toLocaleString()} orders across all regions`}
        actions={
          <div className="flex items-center gap-2">
            {canExport && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExport}
                disabled={isLoading || orders.length === 0}
              >
                <Download size={16} />
                Export CSV
              </Button>
            )}
            <RefreshButton onClick={() => refetch()} isLoading={isLoading} />
          </div>
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
