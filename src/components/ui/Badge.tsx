import { ReactNode, HTMLAttributes } from 'react';
import { cn } from '@/src/lib/utils';
import { OrderStatus } from '@/src/types';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: 'default' | 'gold' | 'ivory' | 'success' | 'danger' | 'warning' | 'info';
  status?: OrderStatus;
  className?: string; // Explicitly adding this to avoid TS issues with destructuring
}

const Badge = ({ children, variant = 'default', status, className, ...props }: BadgeProps) => {
  const variants = {
    default: 'bg-graphite text-ivory',
    gold: 'bg-dark-gold text-white',
    ivory: 'bg-ivory text-void',
    success: 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30',
    danger: 'bg-crimson/20 text-crimson border border-crimson/30',
    warning: 'bg-amber-600/20 text-amber-400 border border-amber-600/30',
    info: 'bg-blue-600/20 text-blue-400 border border-blue-600/30',
  };

  const statusVariants: Record<string, string> = {
    [OrderStatus.PENDING]: variants.default,
    [OrderStatus.CONFIRMED]: variants.info,
    [OrderStatus.PROCESSING]: variants.warning,
    [OrderStatus.SHIPPED]: variants.info,
    [OrderStatus.DELIVERED]: variants.success,
    [OrderStatus.CANCELLED]: variants.danger,
  };

  const activeVariant = status ? statusVariants[status] : variants[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-pill text-[10px] font-mono tracking-wider uppercase',
        activeVariant,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};


export default Badge;
