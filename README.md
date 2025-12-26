# 📦 LogiTrack - Real-Time Order & Logistics Tracking Dashboard

<div align="center">

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**A production-grade logistics dashboard handling 10,000+ orders with real-time updates, virtualized rendering, and role-based access control.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [Performance](#-performance-optimizations)

</div>

---

## 🎯 Project Overview

LogiTrack is a frontend-only simulation of an enterprise logistics management system, designed to demonstrate:

- **Scalable data handling** with 10,000+ orders
- **Real-time UI updates** without full page re-renders
- **Role-based access control** for different user types
- **Production-ready architecture** with clean separation of concerns

This project showcases advanced React patterns, state management strategies, and performance optimization techniques typically found in enterprise applications.

---

## ✨ Features

### Core Functionality

| Feature | Description |
|---------|-------------|
| **📊 Dashboard Analytics** | Real-time KPIs including total orders, delivery rates, and status distribution |
| **📋 Virtualized Order List** | Efficiently renders 10,000+ orders with smooth scrolling |
| **🔍 Advanced Filtering** | Multi-criteria search with status, priority, region, and date filters |
| **📍 Live Tracking Map** | Visual representation of delivery agents with real-time position updates |
| **🚨 Exception Management** | Track and resolve delivery failures with severity classification |
| **⚙️ Settings & Permissions** | Role-based feature access with visual permission indicators |

### Order Lifecycle

Orders progress through a visual timeline with color-coded states:

```
Created → Packed → Shipped → Out for Delivery → Delivered
                                              ↘ Failed
```

Each transition triggers:
- Optimistic UI update
- Toast notification
- Timeline history entry
- Real-time sync across views

### Role-Based Access Control

| Role | Capabilities |
|------|--------------|
| **Admin** | Full access to all orders, regions, user management, and exports |
| **Operations** | Region-specific order management and exception resolution |
| **Viewer** | Read-only access to order data within assigned scope |

---

## 🛠 Tech Stack

### Core Framework
- **React 18.3** - UI library with concurrent features
- **TypeScript 5.6** - Static typing for enhanced DX and code quality
- **Vite 5.4** - Next-generation frontend tooling with HMR

### State Management
- **Zustand** - Lightweight state management with subscription selectors
- **TanStack Query (React Query)** - Server state management with caching

### UI & Styling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Lucide React** - Beautiful, consistent icon set
- **clsx + tailwind-merge** - Conditional class composition

### Data & Virtualization
- **TanStack Virtual** - Virtualized list rendering for large datasets
- **date-fns** - Modern date utility library

### Routing
- **React Router DOM 6** - Declarative routing with nested layouts

---

## 📁 Architecture

### Folder Structure

```
src/
├── components/
│   ├── layout/                 # App shell components
│   │   ├── Layout.tsx          # Main layout wrapper with auth guard
│   │   ├── Sidebar.tsx         # Collapsible navigation sidebar
│   │   └── Header.tsx          # Page header with actions
│   │
│   ├── orders/                 # Order-specific components
│   │   ├── OrderTimeline.tsx   # Visual timeline for order states
│   │   ├── OrderFilters.tsx    # Multi-criteria filter panel
│   │   ├── OrderRow.tsx        # Memoized list row component
│   │   └── VirtualizedOrderList.tsx  # Performance-optimized list
│   │
│   └── ui/                     # Reusable UI primitives
│       ├── Button.tsx          # Variant-based button component
│       ├── Card.tsx            # Container component with variants
│       ├── Input.tsx           # Form input with search variant
│       ├── Select.tsx          # Styled select dropdown
│       ├── StatusBadge.tsx     # Color-coded status indicators
│       ├── Spinner.tsx         # Loading states
│       └── Toast.tsx           # Notification system
│
├── hooks/                      # Custom React hooks
│   ├── useOrders.ts            # Order data fetching & mutations
│   ├── useAgents.ts            # Delivery agent management
│   ├── useDashboard.ts         # Dashboard statistics
│   └── useExceptions.ts        # Exception handling
│
├── pages/                      # Route-level components
│   ├── LoginPage.tsx           # Role selection & authentication
│   ├── DashboardPage.tsx       # Analytics overview
│   ├── OrdersPage.tsx          # Main order list view
│   ├── OrderDetailPage.tsx     # Individual order details
│   ├── TrackingPage.tsx        # Live map & agent tracking
│   ├── ExceptionsPage.tsx      # Failure management
│   └── SettingsPage.tsx        # User preferences & permissions
│
├── stores/                     # Zustand state stores
│   ├── authStore.ts            # Authentication & user state
│   ├── ordersStore.ts          # Order data & filters
│   ├── agentsStore.ts          # Delivery agent state
│   └── uiStore.ts              # UI preferences & notifications
│
├── services/
│   └── api.ts                  # Mock API layer with simulated latency
│
├── mocks/
│   └── generators.ts           # Realistic test data generation
│
├── types/
│   └── index.ts                # TypeScript type definitions
│
└── lib/
    └── utils.ts                # Utility functions & constants
```

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Components                            │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │
│  │ Orders  │  │ Detail  │  │Tracking │  │   Dashboard     │ │
│  │  Page   │  │  Page   │  │  Page   │  │      Page       │ │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────────┬────────┘ │
└───────┼────────────┼────────────┼────────────────┼──────────┘
        │            │            │                │
        ▼            ▼            ▼                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Custom Hooks                             │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │ useOrders() │  │ useAgents()  │  │  useDashboard()     │ │
│  └──────┬──────┘  └──────┬───────┘  └──────────┬──────────┘ │
└─────────┼────────────────┼─────────────────────┼────────────┘
          │                │                     │
          ▼                ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    State Management                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   TanStack Query                        │ │
│  │   • Cache management    • Background refetching        │ │
│  │   • Optimistic updates  • Stale-while-revalidate       │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ordersStore  │  │ agentsStore │  │      uiStore        │ │
│  │  (Zustand)  │  │  (Zustand)  │  │     (Zustand)       │ │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
└─────────┼────────────────┼─────────────────────┼────────────┘
          │                │                     │
          ▼                ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      Mock API Layer                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    services/api.ts                      │ │
│  │   • Simulated network latency (100-500ms)              │ │
│  │   • Random failure simulation (5% chance)              │ │
│  │   • Real-time subscription callbacks                   │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                  mocks/generators.ts                    │ │
│  │   • 10,000 realistic orders                            │ │
│  │   • 50 delivery agents                                 │ │
│  │   • Proper status distribution                         │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚡ Performance Optimizations

### 1. Virtualized Rendering
```tsx
// Only visible rows are rendered (typically 20-30 of 10,000)
const rowVirtualizer = useVirtualizer({
  count: orders.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 64,
  overscan: 20, // Buffer for smooth scrolling
});
```

### 2. Memoized Components
```tsx
// OrderRow only re-renders when its specific data changes
export const OrderRow = memo(function OrderRow({ order, ...props }) {
  // Component implementation
}, (prevProps, nextProps) => {
  return (
    prevProps.order.id === nextProps.order.id &&
    prevProps.order.status === nextProps.order.status &&
    prevProps.order.updatedAt === nextProps.order.updatedAt
  );
});
```

### 3. Efficient State Updates
```tsx
// Zustand store with Map for O(1) lookups
orders: Map<string, Order>;

// Granular subscriptions prevent unnecessary re-renders
const orderStatus = useOrdersStore(state => state.orders.get(orderId)?.status);
```

### 4. Debounced Search
```tsx
// Prevents excessive filtering on every keystroke
const debouncedSearch = useCallback(
  debounce((value: string) => {
    onFilterChange({ search: value || undefined });
  }, 300),
  [onFilterChange]
);
```

### 5. Optimistic Updates
```tsx
// UI updates immediately, rolls back on error
onMutate: async ({ orderId, updates }) => {
  updateOrder(orderId, updates); // Optimistic
},
onError: () => {
  refetch(); // Rollback on failure
},
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Shagufta-Wagnak/logistics.git

# Navigate to project directory
cd logistics

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at `http://localhost:5173` |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 📱 Screens

### 1. Login / Role Selection
- Choose between Admin, Operations, or Viewer roles
- Operations users select their assigned region
- Persisted authentication state

### 2. Dashboard
- KPI cards with week-over-week comparisons
- Status distribution chart
- Recent orders list
- Real-time update indicator

### 3. Orders List
- Virtualized table handling 10,000+ rows
- Multi-column sorting
- Advanced filters (status, priority, region, date)
- Search across order number, customer, tracking
- Mini progress timeline per row

### 4. Order Details
- Full order timeline visualization
- Customer information
- Shipping address with region
- Order items with pricing
- Action buttons based on permissions

### 5. Live Tracking
- Map view with delivery agent positions
- Agent list with status indicators
- Synced selection between map and list
- Real-time location updates

### 6. Exceptions
- Severity-based categorization
- Filter by type and severity
- Resolution workflow for authorized users
- Statistics overview

### 7. Settings
- User profile display
- Permission visibility matrix
- Real-time toggle control
- View mode preferences

---

## 🔒 Security Considerations

While this is a frontend-only demo, it implements patterns suitable for production:

- **Route guards** prevent unauthorized access
- **Permission checks** before sensitive operations
- **Role-based UI rendering** hides unavailable features
- **Optimistic updates** with proper error handling

In a production environment, these would be complemented by:
- JWT token authentication
- Server-side permission validation
- HTTPS encryption
- CSRF protection

---

## 🎨 Design System

### Color Palette
- **Primary**: Amber (#F59E0B) - Actions, highlights
- **Success**: Emerald (#10B981) - Delivered, positive
- **Warning**: Orange (#F97316) - Attention needed
- **Error**: Red (#EF4444) - Failed, critical
- **Background**: Slate (#0A0E17 → #1A2332) - Dark theme

### Typography
- **Font**: JetBrains Mono - Monospace for technical feel
- **Hierarchy**: Clear size progression for headings

### Components
- Consistent border radius (lg/xl)
- Subtle borders with transparency
- Glass morphism on overlays
- Smooth transitions (200-300ms)

---

## 📄 Type Definitions

### Core Types

```typescript
// Order lifecycle states
type OrderStatus = 
  | 'created' 
  | 'packed' 
  | 'shipped' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'failed';

// User roles with different permissions
type UserRole = 'admin' | 'ops' | 'viewer';

// Order structure
interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  status: OrderStatus;
  priority: OrderPriority;
  items: OrderItem[];
  totalAmount: number;
  timeline: OrderTimeline[];
  region: string;
  // ... additional fields
}
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built withs React, TypeScript, and Tailwind CSS**

</div>
