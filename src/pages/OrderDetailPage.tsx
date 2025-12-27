import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder, useOrders } from '@/hooks/useOrders';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { StatusBadge, PriorityBadge } from '@/components/ui/StatusBadge';
import { OrderTimeline } from '@/components/orders/OrderTimeline';
import { PageLoader } from '@/components/ui/Spinner';
import { formatCurrency, formatDate, getNextStatus, ORDER_STATUSES } from '@/lib/utils';
import type { OrderStatus, OrderPriority } from '@/types';
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
  ChevronRight,
  Edit2,
  X,
  Save,
  RotateCcw
} from 'lucide-react';

export function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { order, isLoading } = useOrder(orderId || null);
  const { updateOrder } = useOrders();
  const { hasPermission } = useAuthStore();
  const { addNotification } = useUIStore();
  
  const canEdit = hasPermission('canEditOrders');
  const nextStatus = order ? getNextStatus(order.status) : null;
  
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editedPriority, setEditedPriority] = useState<OrderPriority | null>(null);
  const [editedStatus, setEditedStatus] = useState<OrderStatus | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAdvanceStatus = useCallback(async () => {
    if (!order || !nextStatus) return;
    
    setIsUpdating(true);
    try {
      await updateOrder(order.id, { status: nextStatus });
      addNotification({
        type: 'success',
        title: 'Status updated',
        message: `Order advanced to ${nextStatus.replace('_', ' ')}`,
      });
    } catch {
      addNotification({
        type: 'error',
        title: 'Update failed',
        message: 'Failed to update order status',
      });
    } finally {
      setIsUpdating(false);
    }
  }, [order, nextStatus, updateOrder, addNotification]);

  const handleMarkFailed = useCallback(async () => {
    if (!order) return;
    
    setIsUpdating(true);
    try {
      await updateOrder(order.id, { 
        status: 'failed',
        failureReason: 'Marked failed by operator'
      });
      addNotification({
        type: 'warning',
        title: 'Order marked as failed',
        message: `Order ${order.orderNumber} has been marked as failed`,
      });
    } catch {
      addNotification({
        type: 'error',
        title: 'Update failed',
        message: 'Failed to update order status',
      });
    } finally {
      setIsUpdating(false);
    }
  }, [order, updateOrder, addNotification]);

  const handleRetryDelivery = useCallback(async () => {
    if (!order) return;
    
    setIsUpdating(true);
    try {
      await updateOrder(order.id, { 
        status: 'out_for_delivery',
        failureReason: undefined
      });
      addNotification({
        type: 'success',
        title: 'Delivery retried',
        message: `Order ${order.orderNumber} is back out for delivery`,
      });
    } catch {
      addNotification({
        type: 'error',
        title: 'Retry failed',
        message: 'Failed to retry delivery',
      });
    } finally {
      setIsUpdating(false);
    }
  }, [order, updateOrder, addNotification]);

  const startEditing = useCallback(() => {
    if (!order) return;
    setEditedPriority(order.priority);
    setEditedStatus(order.status);
    setIsEditing(true);
  }, [order]);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    setEditedPriority(null);
    setEditedStatus(null);
  }, []);

  const saveEdits = useCallback(async () => {
    if (!order) return;
    
    const updates: { priority?: OrderPriority; status?: OrderStatus } = {};
    
    if (editedPriority && editedPriority !== order.priority) {
      updates.priority = editedPriority;
    }
    if (editedStatus && editedStatus !== order.status) {
      updates.status = editedStatus;
    }
    
    if (Object.keys(updates).length === 0) {
      setIsEditing(false);
      return;
    }
    
    setIsUpdating(true);
    try {
      await updateOrder(order.id, updates);
      addNotification({
        type: 'success',
        title: 'Order updated',
        message: 'Order details have been saved',
      });
      setIsEditing(false);
    } catch {
      addNotification({
        type: 'error',
        title: 'Update failed',
        message: 'Failed to save order changes',
      });
    } finally {
      setIsUpdating(false);
    }
  }, [order, editedPriority, editedStatus, updateOrder, addNotification]);

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
            {order.status === 'failed' && canEdit && (
              <Button 
                variant="outline" 
                onClick={handleRetryDelivery}
                disabled={isUpdating}
              >
                <RotateCcw size={16} />
                Retry Delivery
              </Button>
            )}
            {order.status === 'failed' && (
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-sm">
                <AlertTriangle size={16} />
                {order.failureReason}
              </span>
            )}
            {canEdit && !isEditing && (
              <>
                {nextStatus && order.status !== 'delivered' && order.status !== 'failed' && (
                  <Button onClick={handleAdvanceStatus} disabled={isUpdating}>
                    Advance to {nextStatus.replace('_', ' ')}
                    <ChevronRight size={16} />
                  </Button>
                )}
                {order.status !== 'delivered' && order.status !== 'failed' && (
                  <Button variant="outline" onClick={startEditing}>
                    <Edit2 size={16} />
                    Edit
                  </Button>
                )}
              </>
            )}
            {canEdit && isEditing && (
              <>
                <Button onClick={saveEdits} disabled={isUpdating}>
                  <Save size={16} />
                  Save
                </Button>
                <Button variant="ghost" onClick={cancelEditing}>
                  <X size={16} />
                  Cancel
                </Button>
              </>
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
          <div className="flex items-center gap-4 flex-wrap">
            {isEditing ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Status:</span>
                  <Select
                    value={editedStatus || order.status}
                    onChange={(e) => setEditedStatus(e.target.value as OrderStatus)}
                    className="w-40"
                    options={ORDER_STATUSES.map(status => ({
                      value: status,
                      label: status.replace('_', ' ')
                    }))}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Priority:</span>
                  <Select
                    value={editedPriority || order.priority}
                    onChange={(e) => setEditedPriority(e.target.value as OrderPriority)}
                    className="w-32"
                    options={[
                      { value: 'low', label: 'Low' },
                      { value: 'normal', label: 'Normal' },
                      { value: 'high', label: 'High' },
                      { value: 'urgent', label: 'Urgent' },
                    ]}
                  />
                </div>
              </>
            ) : (
              <>
                <StatusBadge status={order.status} size="lg" />
                <PriorityBadge priority={order.priority} size="lg" />
              </>
            )}
            {order.trackingNumber && (
              <span className="text-sm text-slate-400">
                Tracking: <span className="font-mono text-amber-400">{order.trackingNumber}</span>
              </span>
            )}
            {canEdit && order.status !== 'delivered' && order.status !== 'failed' && !isEditing && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto text-red-400 hover:text-red-300 hover:bg-red-500/10"
                onClick={handleMarkFailed}
                disabled={isUpdating}
              >
                <AlertTriangle size={14} />
                Mark Failed
              </Button>
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
