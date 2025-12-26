import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  isSearch?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, isSearch, ...props }, ref) => {
    const IconComponent = isSearch ? Search : null;
    
    return (
      <div className="relative">
        {(icon || IconComponent) && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            {icon || (IconComponent && <IconComponent size={18} />)}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full h-10 bg-slate-800/50 border border-slate-700 rounded-lg',
            'text-slate-200 placeholder:text-slate-500',
            'focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50',
            'transition-all duration-200',
            (icon || isSearch) ? 'pl-10 pr-4' : 'px-4',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

