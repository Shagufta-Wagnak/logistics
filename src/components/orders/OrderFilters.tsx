import { memo, useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn, STATUS_CONFIG, PRIORITY_CONFIG, REGIONS, debounce } from '@/lib/utils';
import type { OrderFilters as FilterType, OrderStatus, OrderPriority } from '@/types';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

interface OrderFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: Partial<FilterType>) => void;
  onClearFilters: () => void;
  orderCount: number;
  totalCount: number;
}

export const OrderFilters = memo(function OrderFilters({
  filters,
  onFilterChange,
  onClearFilters,
  orderCount,
  totalCount,
}: OrderFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      onFilterChange({ search: value || null });
    }, 300),
    [onFilterChange]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const toggleStatus = (status: OrderStatus) => {
    const current = filters.status || [];
    const updated = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status];
    onFilterChange({ status: updated.length > 0 ? updated : undefined });
  };

  const togglePriority = (priority: OrderPriority) => {
    const current = filters.priority || [];
    const updated = current.includes(priority)
      ? current.filter((p) => p !== priority)
      : [...current, priority];
    onFilterChange({ priority: updated.length > 0 ? updated : undefined });
  };

  const toggleRegion = (region: string) => {
    const current = filters.region || [];
    const updated = current.includes(region)
      ? current.filter((r) => r !== region)
      : [...current, region];
    onFilterChange({ region: updated.length > 0 ? updated : undefined });
  };

  const hasActiveFilters = 
    (filters.status && filters.status.length > 0) ||
    (filters.priority && filters.priority.length > 0) ||
    (filters.region && filters.region.length > 0) ||
    filters.search;

  return (
    <div className="bg-[#151d2e] rounded-xl border border-slate-800/50 p-4 mb-4">
      {/* Search and Toggle Row */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md">
          <Input
            isSearch
            placeholder="Search orders, customers"
            defaultValue={filters.search || ''}
            onChange={handleSearchChange}
          />
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2"
        >
          <Filter size={16} />
          Filters
          {hasActiveFilters && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-900 text-xs flex items-center justify-center">
              {(filters.status?.length || 0) + (filters.priority?.length || 0) + (filters.region?.length || 0)}
            </span>
          )}
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
        
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="gap-1 text-slate-400">
            <X size={16} />
            Clear
          </Button>
        )}
        
        <div className="text-sm text-slate-400">
          Showing <span className="text-amber-400 font-medium">{orderCount.toLocaleString()}</span> of{' '}
          <span className="text-slate-300">{totalCount.toLocaleString()}</span> orders
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-800/50 space-y-4 animate-fade-in">
          {/* Status Filter */}
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Status</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map((status) => {
                const config = STATUS_CONFIG[status];
                const isActive = filters.status?.includes(status);
                return (
                  <button
                    key={status}
                    onClick={() => toggleStatus(status)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                      'border',
                      isActive
                        ? cn(config.bgColor, config.color, 'border-current')
                        : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800'
                    )}
                  >
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Priority</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PRIORITY_CONFIG) as OrderPriority[]).map((priority) => {
                const config = PRIORITY_CONFIG[priority];
                const isActive = filters.priority?.includes(priority);
                return (
                  <button
                    key={priority}
                    onClick={() => togglePriority(priority)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                      'border',
                      isActive
                        ? cn(config.bgColor, config.color, 'border-current')
                        : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800'
                    )}
                  >
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Region Filter */}
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Region</label>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map((region) => {
                const isActive = filters.region?.includes(region);
                return (
                  <button
                    key={region}
                    onClick={() => toggleRegion(region)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                      'border',
                      isActive
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800'
                    )}
                  >
                    {region}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});


