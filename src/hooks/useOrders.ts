import { useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useOrdersStore } from '@/stores/ordersStore';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import * as api from '@/services/api';
import type { Order, OrderFilters } from '@/types';

export function useOrders() {
  const queryClient = useQueryClient();
  const { 
    setOrders, 
    updateOrder, 
    filters, 
    setFilters,
    clearFilters,
    sortConfig, 
    setSortConfig,
    getFilteredOrders,
    getStats,
    isInitialized,
  } = useOrdersStore();
  
  const { isRealTimeEnabled, setLastUpdateTime, addNotification } = useUIStore();
  const { user } = useAuthStore();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Initial data fetch
  const { isLoading, error, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: api.fetchAllOrders,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Set orders when query succeeds
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (
        event.type === 'updated' &&
        event.query.queryKey[0] === 'orders' &&
        event.query.state.status === 'success'
      ) {
        let orders = event.query.state.data as Order[];
        
        // Apply region filter for ops users
        if (user?.role === 'ops' && user.region) {
          orders = orders.filter((o) => o.region === user.region);
        }
        
        setOrders(orders);
      }
    });

    return () => unsubscribe();
  }, [queryClient, setOrders, user]);

  // Real-time updates subscription
  useEffect(() => {
    if (!isRealTimeEnabled || !isInitialized) {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      return;
    }

    unsubscribeRef.current = api.subscribeToOrderUpdates(({ orderId, changes }) => {
      updateOrder(orderId, changes);
      setLastUpdateTime(new Date().toISOString());
      
      // Show notification for status changes
      if (changes.status) {
        const statusMessages: Record<string, string> = {
          delivered: '✅ Order delivered successfully',
          failed: '❌ Order delivery failed',
          out_for_delivery: '🚚 Order out for delivery',
          shipped: '📦 Order shipped',
          packed: '📋 Order packed',
        };
        
        if (statusMessages[changes.status]) {
          addNotification({
            type: changes.status === 'failed' ? 'error' : 'success',
            title: statusMessages[changes.status],
            message: `Order ${orderId.slice(0, 8)}...`,
            duration: 3000,
          });
        }
      }
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [isRealTimeEnabled, isInitialized, updateOrder, setLastUpdateTime, addNotification]);

  // Update order mutation
  const updateMutation = useMutation({
    mutationFn: ({ orderId, updates }: { orderId: string; updates: Partial<Order> }) =>
      api.updateOrderStatus(orderId, updates),
    onMutate: async ({ orderId, updates }) => {
      // Optimistic update
      updateOrder(orderId, updates);
    },
    onError: (_, { orderId }) => {
      // Revert on error by refetching
      refetch();
      addNotification({
        type: 'error',
        title: 'Update failed',
        message: `Failed to update order ${orderId}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const handleUpdateOrder = useCallback(
    (orderId: string, updates: Partial<Order>) => {
      updateMutation.mutate({ orderId, updates });
    },
    [updateMutation]
  );

  const handleSetFilters = useCallback(
    (newFilters: Partial<OrderFilters>) => {
      setFilters(newFilters);
    },
    [setFilters]
  );

  return {
    orders: getFilteredOrders(),
    stats: getStats(),
    isLoading,
    error,
    filters,
    sortConfig,
    setFilters: handleSetFilters,
    clearFilters,
    setSortConfig,
    updateOrder: handleUpdateOrder,
    refetch,
  };
}

export function useOrder(orderId: string | null) {
  const { getOrder } = useOrdersStore();
  
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => (orderId ? api.fetchOrderById(orderId) : null),
    enabled: !!orderId,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Try store first, fallback to API
  const storeOrder = orderId ? getOrder(orderId) : undefined;
  
  return {
    order: storeOrder || order,
    isLoading: !storeOrder && isLoading,
  };
}

