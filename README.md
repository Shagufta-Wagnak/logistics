# 📦 LogiTrack - Real-Time Order & Logistics Tracking Dashboard

<div align="center">

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![MapLibre](https://img.shields.io/badge/MapLibre_GL-4.7-396CB2?style=for-the-badge&logo=mapbox&logoColor=white)

**A production-grade logistics dashboard handling 10,000+ orders with real-time updates, virtualized rendering, interactive maps, and role-based access control.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [Performance](#-performance-optimizations)

</div>

---

## 🎯 Project Overview

LogiTrack is a **frontend-only simulation** of an enterprise logistics management system, designed to demonstrate:

| Capability | Implementation |
|------------|----------------|
| 🚀 **Scalable Data Handling** | Efficiently renders 10,000+ orders using virtualization |
| ⚡ **Real-time Updates** | Live order status changes without full page re-renders |
| 🔐 **Role-Based Access** | Three-tier permission system (Admin, Ops, Viewer) |
| 🗺️ **Interactive Mapping** | Live delivery agent tracking with MapLibre GL |
| 📊 **Analytics Dashboard** | KPIs, charts, and status distribution |
| 📦 **Order Lifecycle** | Visual timeline with state transitions |

> **Note**: This is a demonstration project showcasing advanced React patterns, state management strategies, and performance optimization techniques typically found in enterprise applications.

---

## ✨ Features

### 📊 Dashboard Analytics
Real-time KPIs with trend indicators:
- **Total Orders** - Complete order count with growth metrics
- **In Transit** - Orders currently being delivered
- **Delivered** - Successful deliveries with success rate
- **Failed** - Exceptions requiring attention
- **Avg Delivery Time** - Mean fulfillment duration
- **On-Time Rate** - Delivery performance percentage

### 📋 Virtualized Order List
High-performance order management:
- **10,000+ Orders** rendered smoothly via TanStack Virtual
- **Multi-criteria Filtering** - Status, priority, region, date range
- **Debounced Search** - Search by order number, customer, tracking
- **Sortable Columns** - Order by any field ascending/descending
- **Mini Progress Timeline** - Visual status indicator per row
- **CSV Export** - Download filtered orders (Admin/Ops only)

### 📍 Live Tracking Map
Interactive delivery visualization:
- **MapLibre GL** integration with dark theme tiles
- **Real-time Agent Markers** with status-coded colors
- **Synced Selection** - Click agent in list ↔ highlights on map
- **Agent Details Panel** - Current order, status, location
- **Auto-fit Bounds** - Map adjusts to show all agents

### 🔄 Order Lifecycle

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────────────┐    ┌───────────┐
│ Created │ →  │ Packed  │ →  │ Shipped │ →  │ Out for Delivery│ →  │ Delivered │
└─────────┘    └─────────┘    └─────────┘    └────────┬────────┘    └───────────┘
                                                      │
                                                      ↓
                                               ┌───────────┐
                                               │  Failed   │
                                               └───────────┘
```

**Each state transition includes:**
- ✅ Optimistic UI update (instant feedback)
- 🔔 Toast notification with status icon
- 📝 Timeline history entry with timestamp
- 🔄 Background sync with mock API

### 🚨 Exception Management
Handle delivery failures efficiently:
- **Severity Levels** - Critical, High, Medium, Low
- **Exception Types** - Delayed, Failed, Missing Location, Partial Failure
- **Filter & Search** - Find exceptions quickly
- **Resolution Workflow** - Mark resolved with notes (Admin/Ops)
- **Statistics Overview** - Exception counts by type/severity

### ⚙️ Settings & Permissions
User preferences and role visibility:
- **Profile Display** - Name, email, role badge
- **Region Assignment** - For Ops users
- **Real-time Toggle** - Enable/disable live updates
- **Permission Matrix** - Visual comparison across all roles (Admin only)

---

## 🔐 Role-Based Access Control

| Permission | Admin | Operations | Viewer |
|------------|:-----:|:----------:|:------:|
| View All Orders | ✅ | ❌ (region only) | ❌ (region only) |
| Edit Orders | ✅ | ✅ | ❌ |
| View All Regions | ✅ | ❌ | ❌ |
| Export Data | ✅ | ✅ | ❌ |
| Resolve Exceptions | ✅ | ✅ | ❌ |
| View Permissions | ✅ | ❌ | ❌ |

### Role Descriptions

| Role | Access Level | Use Case |
|------|--------------|----------|
| **Administrator** | Full system access | System administrators, managers |
| **Operations** | Region-specific management | Regional coordinators, dispatchers |
| **Viewer** | Read-only access | Support staff, auditors |

---

## 🛠 Tech Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3 | UI library with concurrent features |
| TypeScript | 5.6 | Static typing for enhanced DX |
| Vite | 5.4 | Fast dev server with HMR |

### State Management
| Library | Purpose |
|---------|---------|
| **Zustand** | Lightweight global state with subscription selectors |
| **TanStack Query** | Server state, caching, background refetching |

### UI & Styling
| Library | Purpose |
|---------|---------|
| **Tailwind CSS 3.4** | Utility-first styling |
| **Lucide React** | Beautiful icon set |
| **clsx + tailwind-merge** | Conditional class composition |

### Data & Visualization
| Library | Purpose |
|---------|---------|
| **TanStack Virtual** | Virtualized rendering for large lists |
| **MapLibre GL** | Interactive WebGL maps |
| **date-fns** | Date formatting utilities |

### Routing
| Library | Purpose |
|---------|---------|
| **React Router DOM 6** | Declarative routing with nested layouts |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/                 # App shell components
│   │   ├── Layout.tsx          # Main wrapper with auth guard
│   │   ├── Sidebar.tsx         # Collapsible navigation
│   │   └── Header.tsx          # Page header with actions
│   │
│   ├── orders/                 # Order-specific components
│   │   ├── OrderTimeline.tsx   # Visual state timeline
│   │   ├── OrderFilters.tsx    # Multi-criteria filters
│   │   ├── OrderRow.tsx        # Memoized list row
│   │   └── VirtualizedOrderList.tsx  # TanStack Virtual list
│   │
│   └── ui/                     # Reusable primitives
│       ├── Button.tsx          # Variant-based button
│       ├── Card.tsx            # Container component
│       ├── Input.tsx           # Form inputs
│       ├── Select.tsx          # Dropdowns
│       ├── StatusBadge.tsx     # Status indicators
│       ├── Spinner.tsx         # Loading states
│       └── Toast.tsx           # Notifications
│
├── hooks/                      # Custom React hooks
│   ├── useOrders.ts            # Order CRUD + real-time
│   ├── useAgents.ts            # Delivery agent state
│   ├── useDashboard.ts         # Dashboard statistics
│   └── useExceptions.ts        # Exception handling
│
├── pages/                      # Route components
│   ├── LoginPage.tsx           # Role selection
│   ├── DashboardPage.tsx       # Analytics overview
│   ├── OrdersPage.tsx          # Order list + filters
│   ├── OrderDetailPage.tsx     # Single order view
│   ├── TrackingPage.tsx        # Map + agent list
│   ├── ExceptionsPage.tsx      # Failure management
│   └── SettingsPage.tsx        # Preferences + permissions
│
├── stores/                     # Zustand stores
│   ├── authStore.ts            # Auth + user state
│   ├── ordersStore.ts          # Orders + filters
│   ├── agentsStore.ts          # Delivery agents
│   └── uiStore.ts              # UI state + notifications
│
├── services/
│   └── api.ts                  # Mock API with latency
│
├── mocks/
│   └── generators.ts           # Seeded data generation
│
├── types/
│   └── index.ts                # TypeScript definitions
│
└── lib/
    └── utils.ts                # Utilities + constants
```

---

## 🏗 Architecture

### Data Flow

```
┌────────────────────────────────────────────────────────────────────┐
│                          COMPONENTS                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │ Orders   │  │ Detail   │  │ Tracking │  │    Dashboard     │   │
│  │  Page    │  │  Page    │  │   Page   │  │       Page       │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────────┬─────────┘   │
└───────┼─────────────┼─────────────┼─────────────────┼─────────────┘
        │             │             │                 │
        ▼             ▼             ▼                 ▼
┌────────────────────────────────────────────────────────────────────┐
│                        CUSTOM HOOKS                                 │
│  ┌─────────────────┐  ┌────────────────┐  ┌────────────────────┐  │
│  │   useOrders()   │  │  useAgents()   │  │   useDashboard()   │  │
│  │  • Fetch/cache  │  │  • Agent state │  │   • Statistics     │  │
│  │  • Mutations    │  │  • Location    │  │   • Aggregations   │  │
│  │  • Real-time    │  │  • Updates     │  │   • Trends         │  │
│  └────────┬────────┘  └───────┬────────┘  └─────────┬──────────┘  │
└───────────┼───────────────────┼─────────────────────┼─────────────┘
            │                   │                     │
            ▼                   ▼                     ▼
┌────────────────────────────────────────────────────────────────────┐
│                      STATE MANAGEMENT                               │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                    TanStack Query                           │   │
│  │   • Query caching       • Stale-while-revalidate           │   │
│  │   • Background refetch  • Optimistic updates               │   │
│  └────────────────────────────────────────────────────────────┘   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐    │
│  │ ordersStore  │  │ agentsStore  │  │      uiStore         │    │
│  │   (Zustand)  │  │   (Zustand)  │  │     (Zustand)        │    │
│  │  • Map<id>   │  │  • Positions │  │  • Notifications     │    │
│  │  • Filters   │  │  • Status    │  │  • Sidebar state     │    │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘    │
└─────────┼─────────────────┼─────────────────────┼────────────────┘
          │                 │                     │
          ▼                 ▼                     ▼
┌────────────────────────────────────────────────────────────────────┐
│                       MOCK API LAYER                                │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                     services/api.ts                         │   │
│  │   • Simulated latency (100-500ms)                          │   │
│  │   • 5% random failure rate                                 │   │
│  │   • Real-time subscriptions (2-5s intervals)               │   │
│  │   • Order status progression                               │   │
│  └────────────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                   mocks/generators.ts                       │   │
│  │   • Seeded PRNG for consistent data                        │   │
│  │   • 10,000 realistic orders                                │   │
│  │   • 50 delivery agents with coordinates                    │   │
│  │   • Proper status distribution (35% delivered, etc.)       │   │
│  └────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Performance Optimizations

### 1. Virtualized Rendering
Only visible rows are rendered (~20-30 of 10,000):

```tsx
const rowVirtualizer = useVirtualizer({
  count: orders.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 64,
  overscan: 20, // Buffer for smooth scrolling
});
```

### 2. Memoized Components
Custom comparison prevents unnecessary re-renders:

```tsx
export const OrderRow = memo(function OrderRow({ order }) {
  // ...
}, (prev, next) => {
  return (
    prev.order.id === next.order.id &&
    prev.order.status === next.order.status &&
    prev.order.updatedAt === next.order.updatedAt
  );
});
```

### 3. Efficient State with Map
O(1) lookups instead of O(n) array searches:

```tsx
// Zustand store
orders: Map<string, Order>;

// Granular subscription
const status = useOrdersStore(s => s.orders.get(orderId)?.status);
```

### 4. Debounced Search
Prevents excessive filtering:

```tsx
const debouncedSearch = useMemo(
  () => debounce((value: string) => {
    onFilterChange({ search: value || null });
  }, 300),
  [onFilterChange]
);
```

### 5. Seeded Random Generation
Consistent data across page reloads:

```tsx
// Mulberry32 PRNG with fixed seed
function createSeededRandom(seed: number) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
```

### 6. Optimistic Updates
Instant UI feedback with rollback:

```tsx
const updateMutation = useMutation({
  onMutate: async ({ orderId, updates }) => {
    updateOrder(orderId, updates); // Instant update
  },
  onError: () => {
    refetch(); // Rollback on failure
  },
});
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ (20+ recommended)
- **npm** or **yarn**

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
| `npm run dev` | Start dev server at `http://localhost:5173` |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 📱 Screen Overview

### 1. 🔐 Login / Role Selection
- Three role options with visual cards
- Region selector for Operations role
- Persistent authentication via localStorage

### 2. 📊 Dashboard
- 6 KPI cards with trend indicators
- Status distribution breakdown
- Recent orders quick list
- Live update status indicator

### 3. 📋 Orders List
- Virtualized table (10,000+ rows)
- Advanced filter panel
- CSV export button
- Click-through to details

### 4. 📄 Order Details
- Full order timeline
- Edit controls (status, priority)
- Customer & shipping info
- Item breakdown with totals

### 5. 🗺️ Live Tracking
- Interactive MapLibre GL map
- Agent markers with names
- Status-coded colors
- List ↔ map selection sync

### 6. 🚨 Exceptions
- Severity-based table
- Type filtering
- Resolution actions
- Statistics cards

### 7. ⚙️ Settings
- Profile card
- Real-time toggle
- Your permissions list
- Role comparison matrix (Admin)

---

## 🎨 Design System

### Color Palette
| Color | Usage | Hex |
|-------|-------|-----|
| **Amber** | Primary actions, highlights | `#F59E0B` |
| **Emerald** | Success, delivered | `#10B981` |
| **Blue** | Info, shipped | `#3B82F6` |
| **Orange** | Warnings, attention | `#F97316` |
| **Red** | Errors, failed | `#EF4444` |
| **Slate** | Backgrounds, text | `#0A0E17` → `#CBD5E1` |

### Typography
- **Font**: JetBrains Mono (monospace aesthetic)
- **Sizes**: text-xs → text-4xl progression
- **Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)

### Component Patterns
- Consistent `rounded-lg` / `rounded-xl` borders
- `border-slate-700/50` subtle boundaries
- `bg-slate-800/30` glass morphism
- `transition-all duration-200` smooth animations

---

## 📄 Type Definitions

```typescript
// Order status lifecycle
type OrderStatus = 
  | 'created' 
  | 'packed' 
  | 'shipped' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'failed';

// Priority levels
type OrderPriority = 'low' | 'normal' | 'high' | 'urgent';

// User roles
type UserRole = 'admin' | 'ops' | 'viewer';

// Core order interface
interface Order {
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
  shippingAddress: Address;
  timeline: TimelineEntry[];
  region: string;
  trackingNumber?: string;
  assignedDriver?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

// Delivery agent
interface DeliveryAgent {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'available' | 'on_delivery' | 'break' | 'offline';
  currentOrderId?: string;
  currentLocation: { lat: number; lng: number };
  totalDeliveries: number;
  rating: number;
}
```

---

## 🔒 Security Considerations

This frontend-only demo implements patterns suitable for production:

| Pattern | Implementation |
|---------|----------------|
| **Route Guards** | `Navigate` redirect for unauthenticated users |
| **Permission Checks** | `hasPermission()` before sensitive operations |
| **Role-Based UI** | Components conditionally render based on role |
| **Optimistic Updates** | Proper error handling with rollback |

### Production Requirements
In a real deployment, complement with:
- JWT token authentication
- Server-side permission validation
- HTTPS encryption
- CSRF protection
- Rate limiting

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with React, TypeScript, and Tailwind CSS**

[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Shagufta-Wagnak/logistics)

</div>
