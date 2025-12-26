import type { Order, DeliveryAgent, DashboardStats, OrderException } from '@/types';
import { generateOrders, generateDeliveryAgents, generateException } from '@/mocks/generators';

// Simulated latency range (ms)
const MIN_LATENCY = 100;
const MAX_LATENCY = 500;

function simulateLatency(): Promise<void> {
  const delay = Math.random() * (MAX_LATENCY - MIN_LATENCY) + MIN_LATENCY;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

// Simulate occasional failures (5% chance)
function maybeThrowError(): void {
  if (Math.random() < 0.05) {
    throw new Error('Simulated network error');
  }
}

// ============================================
// ORDER STORE (In-memory database)
// ============================================

let ordersCache: Order[] | null = null;
let agentsCache: DeliveryAgent[] | null = null;

function getOrdersStore(): Order[] {
  // Generate 10,000 orders for performance testing
  ordersCache ??= generateOrders(10000);
  return ordersCache;
}

function getAgentsStore(): DeliveryAgent[] {
  agentsCache ??= generateDeliveryAgents(50);
  return agentsCache;
}

// ============================================
// API FUNCTIONS
// ============================================

export async function fetchOrders(
  page: number = 1,
  pageSize: number = 100
): Promise<{ orders: Order[]; total: number }> {
  await simulateLatency();
  maybeThrowError();
  
  const allOrders = getOrdersStore();
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    orders: allOrders.slice(start, end),
    total: allOrders.length,
  };
}

export async function fetchAllOrders(): Promise<Order[]> {
  await simulateLatency();
  maybeThrowError();
  
  return getOrdersStore();
}

export async function fetchOrderById(orderId: string): Promise<Order | null> {
  await simulateLatency();
  maybeThrowError();
  
  const orders = getOrdersStore();
  return orders.find((o) => o.id === orderId) || null;
}

export async function updateOrderStatus(
  orderId: string,
  updates: Partial<Order>
): Promise<Order> {
  await simulateLatency();
  maybeThrowError();
  
  const orders = getOrdersStore();
  const index = orders.findIndex((o) => o.id === orderId);
  
  if (index === -1) {
    throw new Error('Order not found');
  }
  
  const updatedOrder = {
    ...orders[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  orders[index] = updatedOrder;
  return updatedOrder;
}

export async function fetchDeliveryAgents(): Promise<DeliveryAgent[]> {
  await simulateLatency();
  maybeThrowError();
  
  return getAgentsStore();
}

export async function fetchAgentById(agentId: string): Promise<DeliveryAgent | null> {
  await simulateLatency();
  
  const agents = getAgentsStore();
  return agents.find((a) => a.id === agentId) || null;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  await simulateLatency();
  maybeThrowError();
  
  const orders = getOrdersStore();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const ordersToday = orders.filter(
    (o) => new Date(o.createdAt) >= today
  ).length;
  
  const statusCounts = orders.reduce(
    (acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');
  const avgDeliveryTime = deliveredOrders.length > 0
    ? deliveredOrders.reduce((sum, o) => {
        if (o.actualDelivery && o.createdAt) {
          return sum + (new Date(o.actualDelivery).getTime() - new Date(o.createdAt).getTime());
        }
        return sum;
      }, 0) / deliveredOrders.length / (1000 * 60 * 60) // Convert to hours
    : 0;
  
  return {
    totalOrders: orders.length,
    ordersToday,
    pendingOrders: (statusCounts.created || 0) + (statusCounts.packed || 0),
    inTransit: (statusCounts.shipped || 0) + (statusCounts.out_for_delivery || 0),
    delivered: statusCounts.delivered || 0,
    failed: statusCounts.failed || 0,
    avgDeliveryTime: Math.round(avgDeliveryTime),
    onTimeDeliveryRate: 0.94, // Simulated
  };
}

export async function fetchExceptions(): Promise<OrderException[]> {
  await simulateLatency();
  maybeThrowError();
  
  const orders = getOrdersStore();
  const failedOrders = orders.filter((o) => o.status === 'failed');
  
  // Generate exceptions for failed orders + some random ones
  const exceptions: OrderException[] = failedOrders
    .slice(0, 50)
    .map((o) => generateException(o.id));
  
  return exceptions;
}

export async function resolveException(
  exceptionId: string,
  resolution: string
): Promise<void> {
  await simulateLatency();
  maybeThrowError();
  // In a real app, this would update the exception in the database
  console.log(`Exception ${exceptionId} resolved: ${resolution}`);
}

// ============================================
// REAL-TIME SIMULATION
// ============================================

type UpdateCallback = (update: {
  orderId: string;
  changes: Partial<Order>;
}) => void;

type AgentUpdateCallback = (update: {
  agentId: string;
  lat: number;
  lng: number;
}) => void;

let orderUpdateInterval: ReturnType<typeof setInterval> | null = null;
let agentUpdateInterval: ReturnType<typeof setInterval> | null = null;

export function subscribeToOrderUpdates(callback: UpdateCallback): () => void {
  // Simulate order status updates every 2-5 seconds
  orderUpdateInterval = setInterval(() => {
    const orders = getOrdersStore();
    const activeOrders = orders.filter(
      (o) => !['delivered', 'failed'].includes(o.status)
    );
    
    if (activeOrders.length === 0) return;
    
    // Pick a random order to update
    const order = activeOrders[Math.floor(Math.random() * activeOrders.length)];
    const statusFlow = ['created', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
    const currentIndex = statusFlow.indexOf(order.status);
    
    if (currentIndex < statusFlow.length - 1) {
      // 90% chance to advance, 10% chance to fail
      const shouldFail = Math.random() < 0.1;
      const newStatus = shouldFail ? 'failed' : statusFlow[currentIndex + 1];
      
      const changes: Partial<Order> = {
        status: newStatus as Order['status'],
        updatedAt: new Date().toISOString(),
        timeline: [
          ...order.timeline,
          {
            status: newStatus as Order['status'],
            timestamp: new Date().toISOString(),
            note: shouldFail ? 'Delivery failed' : `Status updated to ${newStatus}`,
          },
        ],
      };
      
      if (shouldFail) {
        changes.failureReason = 'Customer not available';
      }
      
      // Update the cache
      const index = orders.findIndex((o) => o.id === order.id);
      if (index !== -1) {
        orders[index] = { ...orders[index], ...changes };
      }
      
      callback({ orderId: order.id, changes });
    }
  }, Math.random() * 3000 + 2000);
  
  return () => {
    if (orderUpdateInterval) {
      clearInterval(orderUpdateInterval);
      orderUpdateInterval = null;
    }
  };
}

export function subscribeToAgentUpdates(callback: AgentUpdateCallback): () => void {
  // Simulate agent location updates every 1-2 seconds
  agentUpdateInterval = setInterval(() => {
    const agents = getAgentsStore();
    const activeAgents = agents.filter((a) => a.status === 'on_delivery');
    
    if (activeAgents.length === 0) return;
    
    // Update multiple agents at once
    const agentsToUpdate = activeAgents
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(5, activeAgents.length));
    
    for (const agent of agentsToUpdate) {
      // Small random movement
      const newLat = agent.currentLocation.lat + (Math.random() - 0.5) * 0.01;
      const newLng = agent.currentLocation.lng + (Math.random() - 0.5) * 0.01;
      
      // Update cache
      const index = agents.findIndex((a) => a.id === agent.id);
      if (index !== -1) {
        agents[index] = {
          ...agents[index],
          currentLocation: { lat: newLat, lng: newLng },
        };
      }
      
      callback({ agentId: agent.id, lat: newLat, lng: newLng });
    }
  }, Math.random() * 1000 + 1000);
  
  return () => {
    if (agentUpdateInterval) {
      clearInterval(agentUpdateInterval);
      agentUpdateInterval = null;
    }
  };
}

// Reset mock data (useful for testing)
export function resetMockData(): void {
  ordersCache = null;
  agentsCache = null;
}

