import type { 
  Order, 
  OrderStatus, 
  OrderPriority, 
  DeliveryAgent, 
  User, 
  OrderException,
  ExceptionType 
} from '@/types';
import { generateOrderNumber, generateTrackingNumber, REGIONS } from '@/lib/utils';

// ============================================
// MOCK DATA CONSTANTS
// ============================================

const FIRST_NAMES = [
  'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Christopher', 'Karen', 'Daniel', 'Nancy', 'Matthew', 'Lisa',
  'Anthony', 'Betty', 'Mark', 'Margaret', 'Donald', 'Sandra', 'Steven', 'Ashley',
  'Andrew', 'Kimberly', 'Paul', 'Emily', 'Joshua', 'Donna', 'Kenneth', 'Michelle',
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
];

const STREET_NAMES = [
  'Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Pine Rd', 'Elm St', 'Washington Blvd',
  'Park Ave', 'Lake Dr', 'Hill Rd', 'River Rd', 'Forest Ave', 'Sunset Blvd', 'Ocean Dr',
  'Mountain View', 'Valley Rd', 'Spring St', 'Church St', 'Market St', 'High St',
];

const CITIES = [
  { city: 'New York', state: 'NY', region: 'Northeast' },
  { city: 'Los Angeles', state: 'CA', region: 'West' },
  { city: 'Chicago', state: 'IL', region: 'Central' },
  { city: 'Houston', state: 'TX', region: 'South' },
  { city: 'Phoenix', state: 'AZ', region: 'Southwest' },
  { city: 'Philadelphia', state: 'PA', region: 'Northeast' },
  { city: 'San Antonio', state: 'TX', region: 'South' },
  { city: 'San Diego', state: 'CA', region: 'West' },
  { city: 'Dallas', state: 'TX', region: 'South' },
  { city: 'Seattle', state: 'WA', region: 'Northwest' },
  { city: 'Denver', state: 'CO', region: 'West' },
  { city: 'Boston', state: 'MA', region: 'Northeast' },
  { city: 'Atlanta', state: 'GA', region: 'Southeast' },
  { city: 'Miami', state: 'FL', region: 'Southeast' },
  { city: 'Detroit', state: 'MI', region: 'Central' },
];

const PRODUCTS = [
  { name: 'Wireless Bluetooth Headphones', price: 79.99, sku: 'WBH-001' },
  { name: 'Smart Watch Pro', price: 299.99, sku: 'SWP-002' },
  { name: 'Portable Power Bank 20000mAh', price: 49.99, sku: 'PPB-003' },
  { name: 'USB-C Hub 7-in-1', price: 39.99, sku: 'UCH-004' },
  { name: 'Mechanical Keyboard RGB', price: 129.99, sku: 'MKR-005' },
  { name: 'Gaming Mouse Wireless', price: 69.99, sku: 'GMW-006' },
  { name: '4K Webcam Pro', price: 149.99, sku: 'WCP-007' },
  { name: 'Noise Cancelling Earbuds', price: 199.99, sku: 'NCE-008' },
  { name: 'Laptop Stand Aluminum', price: 59.99, sku: 'LSA-009' },
  { name: 'Wireless Charging Pad', price: 29.99, sku: 'WCP-010' },
  { name: 'Smart Home Hub', price: 89.99, sku: 'SHH-011' },
  { name: 'Fitness Tracker Band', price: 49.99, sku: 'FTB-012' },
  { name: 'Portable SSD 1TB', price: 119.99, sku: 'PSD-013' },
  { name: 'Desk Lamp LED Smart', price: 44.99, sku: 'DLS-014' },
  { name: 'Bluetooth Speaker Mini', price: 34.99, sku: 'BSM-015' },
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateEmail(firstName: string, lastName: string): string {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'icloud.com', 'proton.me'];
  const separator = randomItem(['', '.', '_']);
  const num = Math.random() > 0.5 ? randomInt(1, 99) : '';
  return `${firstName.toLowerCase()}${separator}${lastName.toLowerCase()}${num}@${randomItem(domains)}`;
}

function generatePhone(): string {
  const areaCode = randomInt(200, 999);
  const prefix = randomInt(200, 999);
  const line = randomInt(1000, 9999);
  return `(${areaCode}) ${prefix}-${line}`;
}

function generateCoordinates(city: string): { lat: number; lng: number } {
  // Approximate coordinates for major cities with some randomization
  const cityCoords: Record<string, { lat: number; lng: number }> = {
    'New York': { lat: 40.7128, lng: -74.006 },
    'Los Angeles': { lat: 34.0522, lng: -118.2437 },
    'Chicago': { lat: 41.8781, lng: -87.6298 },
    'Houston': { lat: 29.7604, lng: -95.3698 },
    'Phoenix': { lat: 33.4484, lng: -112.074 },
    'Philadelphia': { lat: 39.9526, lng: -75.1652 },
    'San Antonio': { lat: 29.4241, lng: -98.4936 },
    'San Diego': { lat: 32.7157, lng: -117.1611 },
    'Dallas': { lat: 32.7767, lng: -96.797 },
    'Seattle': { lat: 47.6062, lng: -122.3321 },
    'Denver': { lat: 39.7392, lng: -104.9903 },
    'Boston': { lat: 42.3601, lng: -71.0589 },
    'Atlanta': { lat: 33.749, lng: -84.388 },
    'Miami': { lat: 25.7617, lng: -80.1918 },
    'Detroit': { lat: 42.3314, lng: -83.0458 },
  };
  
  const base = cityCoords[city] ?? { lat: 39.8283, lng: -98.5795 };
  return {
    lat: base.lat + (Math.random() - 0.5) * 0.1,
    lng: base.lng + (Math.random() - 0.5) * 0.1,
  };
}

// ============================================
// GENERATORS
// ============================================

export function generateOrder(index: number, forcedStatus?: OrderStatus): Order {
  const firstName = randomItem(FIRST_NAMES);
  const lastName = randomItem(LAST_NAMES);
  const cityData = randomItem(CITIES);
  
  const statuses: OrderStatus[] = ['created', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'failed'];
  const priorities: OrderPriority[] = ['low', 'normal', 'normal', 'normal', 'high', 'urgent'];
  
  const status = forcedStatus || randomItem(statuses);
  const priority = randomItem(priorities);
  
  // Generate 1-5 items
  const itemCount = randomInt(1, 5);
  const items = Array.from({ length: itemCount }, () => {
    const product = randomItem(PRODUCTS);
    return {
      id: `item-${Math.random().toString(36).substring(2, 9)}`,
      name: product.name,
      quantity: randomInt(1, 3),
      price: product.price,
      sku: product.sku,
    };
  });
  
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // Generate timeline based on status
  const now = new Date();
  const createdDate = randomDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), now);
  const timeline = generateTimeline(status, createdDate);
  
  const coordinates = generateCoordinates(cityData.city);
  
  const order: Order = {
    id: `order-${index}-${Math.random().toString(36).substring(2, 9)}`,
    orderNumber: generateOrderNumber(),
    customerName: `${firstName} ${lastName}`,
    customerEmail: generateEmail(firstName, lastName),
    customerPhone: generatePhone(),
    status,
    priority,
    items,
    totalAmount: Math.round(totalAmount * 100) / 100,
    currency: 'USD',
    shippingAddress: {
      street: `${randomInt(100, 9999)} ${randomItem(STREET_NAMES)}`,
      city: cityData.city,
      state: cityData.state,
      zipCode: `${randomInt(10000, 99999)}`,
      country: 'USA',
      coordinates,
    },
    billingAddress: {
      street: `${randomInt(100, 9999)} ${randomItem(STREET_NAMES)}`,
      city: cityData.city,
      state: cityData.state,
      zipCode: `${randomInt(10000, 99999)}`,
      country: 'USA',
    },
    timeline,
    region: cityData.region,
    createdAt: createdDate.toISOString(),
    updatedAt: timeline[timeline.length - 1].timestamp,
    trackingNumber: status !== 'created' ? generateTrackingNumber() : undefined,
  };
  
  if (status === 'failed') {
    order.failureReason = randomItem([
      'Customer not available',
      'Wrong address',
      'Package damaged',
      'Refused by customer',
      'Address not found',
    ]);
  }
  
  if (status === 'out_for_delivery' || status === 'delivered') {
    order.assignedDriver = `driver-${randomInt(1, 50)}`;
    order.estimatedDelivery = new Date(
      createdDate.getTime() + randomInt(2, 5) * 24 * 60 * 60 * 1000
    ).toISOString();
  }
  
  if (status === 'delivered') {
    order.actualDelivery = timeline[timeline.length - 1].timestamp;
  }
  
  return order;
}

function generateTimeline(status: OrderStatus, createdDate: Date): Order['timeline'] {
  const timeline: Order['timeline'] = [];
  const statusFlow: OrderStatus[] = ['created', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
  const statusIndex = status === 'failed' 
    ? randomInt(1, 3) // Failed can happen at any stage after created
    : statusFlow.indexOf(status);
  
  let currentTime = createdDate.getTime();
  
  for (let i = 0; i <= statusIndex; i++) {
    const currentStatus = statusFlow[i];
    timeline.push({
      status: currentStatus,
      timestamp: new Date(currentTime).toISOString(),
      note: getStatusNote(currentStatus),
    });
    currentTime += randomInt(2, 24) * 60 * 60 * 1000; // 2-24 hours between stages
  }
  
  if (status === 'failed') {
    timeline.push({
      status: 'failed',
      timestamp: new Date(currentTime).toISOString(),
      note: 'Delivery attempt failed',
    });
  }
  
  return timeline;
}

function getStatusNote(status: OrderStatus): string {
  const notes: Record<OrderStatus, string[]> = {
    created: ['Order received', 'Order confirmed', 'Payment verified'],
    packed: ['Items picked from warehouse', 'Package prepared', 'Quality check complete'],
    shipped: ['Handed to carrier', 'In transit to hub', 'Left facility'],
    out_for_delivery: ['Out for delivery', 'With delivery agent', 'On the way'],
    delivered: ['Successfully delivered', 'Handed to recipient', 'Left at door'],
    failed: ['Delivery failed', 'Could not complete delivery', 'Returned to sender'],
  };
  return randomItem(notes[status]);
}

export function generateDeliveryAgent(index: number): DeliveryAgent {
  const firstName = randomItem(FIRST_NAMES);
  const lastName = randomItem(LAST_NAMES);
  const cityData = randomItem(CITIES);
  const coords = generateCoordinates(cityData.city);
  
  return {
    id: `driver-${index}`,
    name: `${firstName} ${lastName}`,
    phone: generatePhone(),
    status: randomItem(['available', 'on_delivery', 'on_delivery', 'on_delivery', 'offline', 'break']),
    currentLocation: coords,
    assignedOrders: [],
    region: cityData.region,
    vehicleType: randomItem(['bike', 'van', 'van', 'truck']),
    rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
    totalDeliveries: randomInt(50, 2000),
  };
}

export function generateMockUser(role: 'admin' | 'ops' | 'viewer', region?: string): User {
  const firstName = randomItem(FIRST_NAMES);
  const lastName = randomItem(LAST_NAMES);
  
  return {
    id: `user-${Math.random().toString(36).substring(2, 9)}`,
    name: `${firstName} ${lastName}`,
    email: generateEmail(firstName, lastName),
    role,
    region: role === 'ops' ? region || randomItem(REGIONS) : undefined,
    createdAt: new Date().toISOString(),
  };
}

export function generateException(orderId: string): OrderException {
  const types: ExceptionType[] = [
    'delayed_delivery',
    'failed_delivery',
    'missing_location',
    'customer_unavailable',
    'address_issue',
    'package_damaged',
  ];
  
  const type = randomItem(types);
  const descriptions: Record<ExceptionType, string[]> = {
    delayed_delivery: ['Weather conditions', 'High volume', 'Route issues', 'Vehicle breakdown'],
    failed_delivery: ['No one home', 'Refused', 'Business closed', 'Access denied'],
    missing_location: ['GPS error', 'Incomplete address', 'New development'],
    customer_unavailable: ['Phone unreachable', 'No response', 'Wrong contact'],
    address_issue: ['Address not found', 'Building demolished', 'Restricted area'],
    package_damaged: ['Transit damage', 'Water damage', 'Crushed package'],
  };
  
  return {
    id: `exc-${Math.random().toString(36).substring(2, 9)}`,
    orderId,
    type,
    description: randomItem(descriptions[type]),
    severity: randomItem(['low', 'medium', 'high', 'critical']),
    createdAt: new Date().toISOString(),
  };
}

// ============================================
// BATCH GENERATORS
// ============================================

export function generateOrders(count: number): Order[] {
  // Distribute orders across statuses realistically
  const distribution = {
    created: 0.1,
    packed: 0.15,
    shipped: 0.2,
    out_for_delivery: 0.15,
    delivered: 0.35,
    failed: 0.05,
  };
  
  const orders: Order[] = [];
  let index = 0;
  
  for (const [status, ratio] of Object.entries(distribution)) {
    const statusCount = Math.floor(count * ratio);
    for (let i = 0; i < statusCount; i++) {
      orders.push(generateOrder(index++, status as OrderStatus));
    }
  }
  
  // Fill remaining with random statuses
  while (orders.length < count) {
    orders.push(generateOrder(index++));
  }
  
  // Shuffle for realism
  return orders.sort(() => Math.random() - 0.5);
}

export function generateDeliveryAgents(count: number): DeliveryAgent[] {
  return Array.from({ length: count }, (_, i) => generateDeliveryAgent(i + 1));
}

