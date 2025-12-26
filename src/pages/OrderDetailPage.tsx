import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '@/hooks/useOrders';
import { useAuthStore } from '@/stores/authStore';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge, PriorityBadge } from '@/components/ui/StatusBadge';
import { OrderTimeline } from '@/components/orders/OrderTimeline';
import { PageLoader } from '@/components/ui/Spinner';
import { formatCurrency, formatDate, getNextStatus } from '@/lib/utils';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Package,
  Truck,
  Calendar,
  Clock,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

export function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { order, isLoading } = useOrder(orderId || null);
  const { hasPermission } = useAuthStore();
  
  const canEdit = hasPermission('canEditOrders');
  const nextStatus = order ? getNextStatus(order.status) : null;

  if (isLoading) {
    return <PageLoader />;
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg text-slate-400">Order not found</p>
        <Button variant="ghost" onClick={() => navigate('/orders')} className="mt-4">
          ← Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Header 
        title={order.orderNumber}
        subtitle={`Created ${formatDate(order.createdAt, 'long')}`}
        actions={
          <div className="flex items-center gap-3">
            {order.status === 'failed' && (
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-sm">
                <AlertTriangle size={16} />
                {order.failureReason}
              </span>
            )}
            {canEdit && nextStatus && (
              <Button>
                Advance to {nextStatus.replace('_', ' ')}
                <ChevronRight size={16} />
              </Button>
            )}
            <Button variant="ghost" onClick={() => navigate('/orders')}>
              <ArrowLeft size={16} />
              Back
            </Button>
          </div>
        }
      />

      {/* Status & Timeline */}
      <Card variant="bordered" className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-4">
            <StatusBadge status={order.status} size="lg" />
            <PriorityBadge priority={order.priority} size="lg" />
            {order.trackingNumber && (
              <span className="text-sm text-slate-400">
                Tracking: <span className="font-mono text-amber-400">{order.trackingNumber}</span>
              </span>
            )}
          </div>
        </CardHeader>
        <div className="mt-6">
          <OrderTimeline 
            timeline={order.timeline} 
            currentStatus={order.status} 
            orientation="horizontal"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <span className="text-sm text-slate-400">{order.items.length} item(s)</span>
            </CardHeader>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                      <Package className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{item.name}</p>
                      <p className="text-xs text-slate-500">SKU: {item.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-200">
                      {formatCurrency(item.price)} × {item.quantity}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between">
              <span className="text-slate-400">Total</span>
              <span className="text-xl font-bold text-amber-400">
                {formatCurrency(order.totalAmount, order.currency)}
              </span>
            </div>
          </Card>

          {/* Timeline Detail */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <OrderTimeline 
              timeline={order.timeline} 
              currentStatus={order.status}
              orientation="vertical"
            />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">{order.customerName}</p>
                  <p className="text-xs text-slate-500">Customer</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">{order.customerEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">{order.customerPhone}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Shipping Address */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-slate-500 mt-0.5" />
              <div className="text-sm text-slate-400">
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin size={12} />
                Region: <span className="text-amber-400">{order.region}</span>
              </span>
            </div>
          </Card>

          {/* Delivery Info */}
          {(order.assignedDriver || order.estimatedDelivery) && (
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Delivery</CardTitle>
              </CardHeader>
              <div className="space-y-3">
                {order.assignedDriver && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Truck className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">Driver Assigned</p>
                      <p className="text-xs text-slate-500 font-mono">{order.assignedDriver}</p>
                    </div>
                  </div>
                )}
                {order.estimatedDelivery && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-400">
                      ETA: {formatDate(order.estimatedDelivery)}
                    </span>
                  </div>
                )}
                {order.actualDelivery && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-400">
                      Delivered: {formatDate(order.actualDelivery, 'long')}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

