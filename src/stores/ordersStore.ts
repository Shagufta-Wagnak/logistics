import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { 
  Order, 
  OrderFilters, 
  SortConfig, 
  OrderStatus,
  OrderUpdate 
} from '@/types';

interface OrdersState {
  // Data
  orders: Map<string, Order>;
  filteredOrderIds: string[];
  selectedOrderId: string | null;
  
  // Filters & Sorting
  filters: OrderFilters;
  sortConfig: SortConfig;
  
  // Loading states
  isLoading: boolean;
  isInitialized: boolean;
  
  // Real-time update queue
  pendingUpdates: OrderUpdate[];
  
  // Actions
  setOrders: (orders: Order[]) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  batchUpdateOrders: (updates: { id: string; changes: Partial<Order> }[]) => void;
  setSelectedOrder: (orderId: string | null) => void;
  
  // Filter actions
  setFilters: (filters: Partial<OrderFilters>) => void;
  clearFilters: () => void;
  setSortConfig: (config: SortConfig) => void;
  
  // Computed
  getOrder: (orderId: string) => Order | undefined;
  getFilteredOrders: () => Order[];
  getOrdersByStatus: (status: OrderStatus) => Order[];
  
  // Real-time
  queueUpdate: (update: OrderUpdate) => void;
  processUpdates: () => void;
  
  // Stats
  getStats: () => {
    total: number;
    byStatus: Record<OrderStatus, number>;
    byPriority: Record<string, number>;
  };
  
  // Reset
  reset: () => void;
}

const defaultFilters: OrderFilters = {};
const defaultSort: SortConfig = { field: 'createdAt', direction: 'desc' };

export const useOrdersStore = create<OrdersState>()(
  subscribeWithSelector((set, get) => ({
    orders: new Map(),
    filteredOrderIds: [],
    selectedOrderId: null,
    filters: defaultFilters,
    sortConfig: defaultSort,
    isLoading: false,
    isInitialized: false,
    pendingUpdates: [],

    setOrders: (orders) => {
      const ordersMap = new Map(orders.map((o) => [o.id, o]));
      set({ 
        orders: ordersMap, 
        isInitialized: true,
        isLoading: false,
      });
      // Trigger filter recalculation
      get().setFilters({});
    },

    updateOrder: (orderId, updates) => {
      set((state) => {
        const order = state.orders.get(orderId);
        if (!order) return state;
        
        const updatedOrder = { 
          ...order, 
          ...updates, 
          updatedAt: new Date().toISOString() 
        };
        
        const newOrders = new Map(state.orders);
        newOrders.set(orderId, updatedOrder);
        
        return { orders: newOrders };
      });
    },

    batchUpdateOrders: (updates) => {
      set((state) => {
        const newOrders = new Map(state.orders);
        const now = new Date().toISOString();
        
        for (const { id, changes } of updates) {
          const order = newOrders.get(id);
          if (order) {
            newOrders.set(id, { ...order, ...changes, updatedAt: now });
          }
        }
        
        return { orders: newOrders };
      });
    },

    setSelectedOrder: (orderId) => set({ selectedOrderId: orderId }),

    setFilters: (newFilters) => {
      set((state) => {
        const filters = { ...state.filters, ...newFilters };
        const filteredIds = filterAndSortOrders(
          state.orders,
          filters,
          state.sortConfig
        );
        return { filters, filteredOrderIds: filteredIds };
      });
    },

    clearFilters: () => {
      set((state) => {
        const filteredIds = filterAndSortOrders(
          state.orders,
          {},
          state.sortConfig
        );
        return { filters: defaultFilters, filteredOrderIds: filteredIds };
      });
    },

    setSortConfig: (config) => {
      set((state) => {
        const filteredIds = filterAndSortOrders(
          state.orders,
          state.filters,
          config
        );
        return { sortConfig: config, filteredOrderIds: filteredIds };
      });
    },

    getOrder: (orderId) => get().orders.get(orderId),

    getFilteredOrders: () => {
      const { orders, filteredOrderIds } = get();
      return filteredOrderIds
        .map((id) => orders.get(id))
        .filter((o): o is Order => o !== undefined);
    },

    getOrdersByStatus: (status) => {
      const { orders } = get();
      return Array.from(orders.values()).filter((o) => o.status === status);
    },

    queueUpdate: (update) => {
      set((state) => ({
        pendingUpdates: [...state.pendingUpdates, update],
      }));
    },

    processUpdates: () => {
      const { pendingUpdates, updateOrder } = get();
      if (pendingUpdates.length === 0) return;

      // Process all pending updates
      for (const update of pendingUpdates) {
        updateOrder(update.orderId, update.payload);
      }

      set({ pendingUpdates: [] });
    },

    getStats: () => {
      const { orders } = get();
      const ordersArray = Array.from(orders.values());
      
      const byStatus: Record<OrderStatus, number> = {
        created: 0,
        packed: 0,
        shipped: 0,
        out_for_delivery: 0,
        delivered: 0,
        failed: 0,
      };
      
      const byPriority: Record<string, number> = {
        low: 0,
        normal: 0,
        high: 0,
        urgent: 0,
      };
      
      for (const order of ordersArray) {
        byStatus[order.status]++;
        byPriority[order.priority]++;
      }
      
      return {
        total: ordersArray.length,
        byStatus,
        byPriority,
      };
    },

    reset: () => {
      set({
        orders: new Map(),
        filteredOrderIds: [],
        selectedOrderId: null,
        filters: defaultFilters,
        sortConfig: defaultSort,
        isLoading: false,
        isInitialized: false,
        pendingUpdates: [],
      });
    },
  }))
);

// Helper function to filter and sort orders
function filterAndSortOrders(
  orders: Map<string, Order>,
  filters: OrderFilters,
  sortConfig: SortConfig
): string[] {
  let filtered = Array.from(orders.values());

  // Apply filters
  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter((o) => filters.status!.includes(o.status));
  }

  if (filters.priority && filters.priority.length > 0) {
    filtered = filtered.filter((o) => filters.priority!.includes(o.priority));
  }

  if (filters.region && filters.region.length > 0) {
    filtered = filtered.filter((o) => filters.region!.includes(o.region));
  }

  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(search) ||
        o.customerName.toLowerCase().includes(search) ||
        o.customerEmail.toLowerCase().includes(search) ||
        o.trackingNumber?.toLowerCase().includes(search)
    );
  }

  if (filters.dateRange) {
    const start = new Date(filters.dateRange.start).getTime();
    const end = new Date(filters.dateRange.end).getTime();
    filtered = filtered.filter((o) => {
      const created = new Date(o.createdAt).getTime();
      return created >= start && created <= end;
    });
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let aVal: string | number;
    let bVal: string | number;

    switch (sortConfig.field) {
      case 'orderNumber':
        aVal = a.orderNumber;
        bVal = b.orderNumber;
        break;
      case 'customerName':
        aVal = a.customerName;
        bVal = b.customerName;
        break;
      case 'status':
        aVal = getStatusOrder(a.status);
        bVal = getStatusOrder(b.status);
        break;
      case 'priority':
        aVal = getPriorityOrder(a.priority);
        bVal = getPriorityOrder(b.priority);
        break;
      case 'totalAmount':
        aVal = a.totalAmount;
        bVal = b.totalAmount;
        break;
      case 'createdAt':
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
        break;
      case 'updatedAt':
        aVal = new Date(a.updatedAt).getTime();
        bVal = new Date(b.updatedAt).getTime();
        break;
      default:
        aVal = a.createdAt;
        bVal = b.createdAt;
    }

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return filtered.map((o) => o.id);
}

function getStatusOrder(status: OrderStatus): number {
  const order: Record<OrderStatus, number> = {
    created: 0,
    packed: 1,
    shipped: 2,
    out_for_delivery: 3,
    delivered: 4,
    failed: 5,
  };
  return order[status];
}

function getPriorityOrder(priority: string): number {
  const order: Record<string, number> = {
    low: 0,
    normal: 1,
    high: 2,
    urgent: 3,
  };
  return order[priority] ?? 1;
}


