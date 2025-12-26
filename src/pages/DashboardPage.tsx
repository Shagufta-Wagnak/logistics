import { useDashboard } from '@/hooks/useDashboard';
import { useOrders } from '@/hooks/useOrders';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/Spinner';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn, formatCurrency, STATUS_CONFIG } from '@/lib/utils';
import type { OrderStatus } from '@/types';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  TrendingUp,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function DashboardPage() {
  const { stats: dashboardStats, isLoading: isDashboardLoading } = useDashboard();
  const { stats: orderStats, orders, isLoading: isOrdersLoading } = useOrders();

  const isLoading = isDashboardLoading || isOrdersLoading;

  if (isLoading) {
    return <PageLoader />;
  }

  const statCards = [
    {
      title: 'Total Orders',
      value: dashboardStats?.totalOrders.toLocaleString() || '0',
      icon: Package,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10',
      change: '+12.5%',
      changeType: 'up' as const,
    },
    {
      title: 'In Transit',
      value: dashboardStats?.inTransit.toLocaleString() || '0',
      icon: Truck,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      change: '+8.2%',
      changeType: 'up' as const,
    },
    {
      title: 'Delivered',
      value: dashboardStats?.delivered.toLocaleString() || '0',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10',
      change: '+15.3%',
      changeType: 'up' as const,
    },
    {
      title: 'Failed',
      value: dashboardStats?.failed.toLocaleString() || '0',
      icon: XCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
      change: '-2.1%',
      changeType: 'down' as const,
    },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <Header 
        title="Dashboard" 
        subtitle="Overview of your logistics operations"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, index) => (
          <Card
            key={stat.title}
            className={cn('animate-slide-up', `stagger-${index + 1}`)}
            variant="bordered"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-100 mt-1">{stat.value}</p>
                <div className={cn(
                  'flex items-center gap-1 mt-2 text-xs font-medium',
                  stat.changeType === 'up' ? 'text-emerald-400' : 'text-red-400'
                )}>
                  {stat.changeType === 'up' ? (
                    <ArrowUpRight size={14} />
                  ) : (
                    <ArrowDownRight size={14} />
                  )}
                  {stat.change} vs last week
                </div>
              </div>
              <div className={cn('p-3 rounded-xl', stat.bgColor)}>
                <stat.icon className={cn('w-6 h-6', stat.color)} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* On-Time Rate */}
        <Card variant="bordered">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-400/10">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">On-Time Delivery Rate</p>
              <p className="text-2xl font-bold text-emerald-400">
                {((dashboardStats?.onTimeDeliveryRate || 0) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>

        {/* Avg Delivery Time */}
        <Card variant="bordered">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-400/10">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Avg. Delivery Time</p>
              <p className="text-2xl font-bold text-slate-100">
                {dashboardStats?.avgDeliveryTime || 0}h
              </p>
            </div>
          </div>
        </Card>

        {/* Pending Orders */}
        <Card variant="bordered">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-400/10">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Pending Orders</p>
              <p className="text-2xl font-bold text-amber-400">
                {dashboardStats?.pendingOrders.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map((status) => {
              const config = STATUS_CONFIG[status];
              const count = orderStats.byStatus[status] || 0;
              const percentage = orderStats.total > 0 
                ? ((count / orderStats.total) * 100).toFixed(1) 
                : '0';
              
              return (
                <div key={status} className="flex items-center gap-4">
                  <div className="w-32">
                    <StatusBadge status={status} size="sm" />
                  </div>
                  <div className="flex-1">
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all duration-500', config.bgColor)}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-20 text-right">
                    <span className="text-sm font-medium text-slate-300">{count.toLocaleString()}</span>
                    <span className="text-xs text-slate-500 ml-1">({percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Orders */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <Link 
              to="/orders" 
              className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
            >
              View all →
            </Link>
          </CardHeader>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-mono text-amber-400">{order.orderNumber}</p>
                  <p className="text-xs text-slate-400">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={order.status} size="sm" showIcon={false} />
                  <p className="text-xs text-slate-500 mt-1">
                    {formatCurrency(order.totalAmount)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

