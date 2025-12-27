import { memo } from 'react';
import { cn, STATUS_CONFIG, formatDate } from '@/lib/utils';
import type { OrderTimeline as TimelineType, OrderStatus } from '@/types';
import { 
  Package, 
  PackageCheck, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  XCircle,
} from 'lucide-react';

interface OrderTimelineProps {
  timeline: TimelineType[];
  currentStatus: OrderStatus;
  orientation?: 'vertical' | 'horizontal';
}

const StatusIcons: Record<OrderStatus, React.ElementType> = {
  created: Package,
  packed: PackageCheck,
  shipped: Truck,
  out_for_delivery: MapPin,
  delivered: CheckCircle2,
  failed: XCircle,
};

const statusFlow: OrderStatus[] = ['created', 'packed', 'shipped', 'out_for_delivery', 'delivered'];

export const OrderTimeline = memo(function OrderTimeline({ 
  timeline, 
  currentStatus,
  orientation = 'horizontal' 
}: OrderTimelineProps) {
  const completedStatuses = timeline.map(t => t.status);
  const isFailed = currentStatus === 'failed';
  
  if (orientation === 'vertical') {
    return <VerticalTimeline timeline={timeline} isFailed={isFailed} />;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Progress Line Background */}
        <div className="absolute left-0 right-0 top-5 h-1 bg-slate-700/50 rounded-full" />
        
        {/* Progress Line Fill */}
        <div 
          className={cn(
            "absolute left-0 top-5 h-1 rounded-full transition-all duration-500",
            isFailed ? "bg-red-500" : "bg-gradient-to-r from-amber-500 to-emerald-500"
          )}
          style={{
            width: isFailed 
              ? `${((completedStatuses.length - 1) / (statusFlow.length - 1)) * 100}%`
              : `${(statusFlow.indexOf(currentStatus) / (statusFlow.length - 1)) * 100}%`
          }}
        />
        
        {statusFlow.map((status) => {
          const isCompleted = completedStatuses.includes(status);
          const isCurrent = status === currentStatus;
          const timelineEntry = timeline.find(t => t.status === status);
          const Icon = StatusIcons[status];
          const config = STATUS_CONFIG[status];
          
          return (
            <div key={status} className="flex flex-col items-center relative z-10">
              {/* Icon Circle */}
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                  'border-2',
                  isCompleted
                    ? 'bg-slate-800 border-emerald-500 text-emerald-400'
                    : isCurrent
                    ? cn('bg-slate-800 animate-pulse', 
                        isFailed ? 'border-red-500 text-red-400' : 'border-amber-500 text-amber-400')
                    : 'bg-slate-800/50 border-slate-700 text-slate-600'
                )}
              >
                <Icon size={18} />
              </div>
              
              {/* Label */}
              <span className={cn(
                'text-xs font-medium mt-2 whitespace-nowrap',
                isCompleted ? 'text-slate-300' : isCurrent ? config.color : 'text-slate-600'
              )}>
                {config.label}
              </span>
              
              {/* Timestamp */}
              {timelineEntry && (
                <span className="text-[10px] text-slate-500 mt-0.5">
                  {formatDate(timelineEntry.timestamp, 'time')}
                </span>
              )}
            </div>
          );
        })}
        
        {/* Failed Status (if applicable) */}
        {isFailed && (
          <div className="flex flex-col items-center relative z-10">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500/20 border-2 border-red-500 text-red-400 animate-pulse">
              <XCircle size={18} />
            </div>
            <span className="text-xs font-medium mt-2 text-red-400">Failed</span>
            {timeline.find(t => t.status === 'failed') && (
              <span className="text-[10px] text-slate-500 mt-0.5">
                {formatDate(timeline.find(t => t.status === 'failed')!.timestamp, 'time')}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

function VerticalTimeline({ timeline, isFailed }: { timeline: TimelineType[]; isFailed: boolean }) {
  return (
    <div className="space-y-4">
      {timeline.map((entry, index) => {
        const Icon = StatusIcons[entry.status];
        const config = STATUS_CONFIG[entry.status];
        const isLast = index === timeline.length - 1;
        
        return (
          <div key={`${entry.status}-${index}`} className="flex gap-4">
            {/* Timeline Line */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  config.bgColor,
                  config.color
                )}
              >
                <Icon size={16} />
              </div>
              {!isLast && (
                <div className={cn(
                  'w-0.5 flex-1 min-h-8 my-1',
                  isFailed && isLast ? 'bg-red-500/30' : 'bg-slate-700'
                )} />
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2">
                <span className={cn('font-medium', config.color)}>{config.label}</span>
                <span className="text-xs text-slate-500">
                  {formatDate(entry.timestamp, 'long')}
                </span>
              </div>
              {entry.note && (
                <p className="text-sm text-slate-400 mt-1">{entry.note}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Mini timeline for list view
export const MiniTimeline = memo(function MiniTimeline({ 
  status 
}: { 
  status: OrderStatus 
}) {
  const currentIndex = statusFlow.indexOf(status);
  const isFailed = status === 'failed';
  
  return (
    <div className="flex items-center gap-1">
      {statusFlow.map((s, index) => {
        const isCompleted = index <= currentIndex && !isFailed;
        const isCurrent = s === status;
        
        return (
          <div
            key={s}
            className={cn(
              'w-2 h-2 rounded-full transition-all',
              isCompleted
                ? 'bg-emerald-500'
                : isCurrent && isFailed
                ? 'bg-red-500'
                : isCurrent
                ? 'bg-amber-500 animate-pulse'
                : 'bg-slate-700'
            )}
            title={STATUS_CONFIG[s].label}
          />
        );
      })}
      {isFailed && (
        <div className="w-2 h-2 rounded-full bg-red-500" title="Failed" />
      )}
    </div>
  );
});


