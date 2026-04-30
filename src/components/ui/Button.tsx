import { motion, HTMLMotionProps } from 'motion/react';
import { ReactNode, forwardRef } from 'react';
import { cn } from '@/src/lib/utils';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const variants = {
      primary: 'bg-dark-gold text-white hover:bg-bright-gold',
      secondary: 'border border-dark-gold text-dark-gold hover:bg-dark-gold hover:text-white',
      outline: 'border border-ivory/20 text-ivory hover:border-ivory/50',
      ghost: 'text-ivory hover:bg-ivory/10',
      danger: 'border border-crimson text-crimson hover:bg-crimson hover:text-white',
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base font-medium',
      icon: 'p-3',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          'relative inline-flex items-center justify-center rounded-sharp tracking-widest uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-dark-gold focus:ring-offset-2 focus:ring-offset-void disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
