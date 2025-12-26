// ============================================
// ORDER TYPES
// ============================================

export type OrderStatus = 
  | 'created' 
  | 'packed' 
  | 'shipped' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'failed';

export type OrderPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface OrderAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  sku: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: OrderStatus;
  priority: OrderPriority;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  timeline: OrderTimeline[];
  assignedDriver?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  region: string;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  failureReason?: string;
  notes?: string;
}

// ============================================
// USER & AUTH TYPES
// ============================================

export type UserRole = 'admin' | 'ops' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  region?: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ============================================
// DELIVERY AGENT TYPES
// ============================================

export type AgentStatus = 'available' | 'on_delivery' | 'offline' | 'break';

export interface DeliveryAgent {
  id: string;
  name: string;
  phone: string;
  status: AgentStatus;
  currentLocation: {
    lat: number;
    lng: number;
  };
  assignedOrders: string[];
  region: string;
  vehicleType: 'bike' | 'van' | 'truck';
  rating: number;
  totalDeliveries: number;
  avatar?: string;
}

// ============================================
// FILTER & SORT TYPES
// ============================================

export interface OrderFilters {
  status?: OrderStatus[];
  priority?: OrderPriority[];
  region?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
  assignedDriver?: string;
}

export type SortField = 
  | 'orderNumber' 
  | 'customerName' 
  | 'status' 
  | 'priority' 
  | 'totalAmount' 
  | 'createdAt' 
  | 'updatedAt';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// ============================================
// REAL-TIME UPDATE TYPES
// ============================================

export type UpdateType = 
  | 'status_change' 
  | 'location_update' 
  | 'assignment_change' 
  | 'priority_change'
  | 'failure';

export interface OrderUpdate {
  type: UpdateType;
  orderId: string;
  payload: Partial<Order>;
  timestamp: string;
}

export interface AgentUpdate {
  agentId: string;
  location: {
    lat: number;
    lng: number;
  };
  timestamp: string;
}

// ============================================
// DASHBOARD STATS TYPES
// ============================================

export interface DashboardStats {
  totalOrders: number;
  ordersToday: number;
  pendingOrders: number;
  inTransit: number;
  delivered: number;
  failed: number;
  avgDeliveryTime: number;
  onTimeDeliveryRate: number;
}

export interface RegionStats {
  region: string;
  totalOrders: number;
  delivered: number;
  pending: number;
  failed: number;
}

// ============================================
// EXCEPTION TYPES
// ============================================

export type ExceptionType = 
  | 'delayed_delivery'
  | 'failed_delivery'
  | 'missing_location'
  | 'customer_unavailable'
  | 'address_issue'
  | 'package_damaged';

export interface OrderException {
  id: string;
  orderId: string;
  type: ExceptionType;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: string;
}

