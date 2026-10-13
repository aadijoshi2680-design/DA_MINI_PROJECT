import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Design system Button component
 * Specs from design.md section 7:
 * - Primary: cyan->violet gradient, dark text, radius 12, 44px height, hover glow, focus ring 2px cyan
 * - Secondary: transparent with 1px border
 */
export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  loading = false,
  disabled = false,
  icon: Icon,
  iconRight: IconRight,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'h-9 px-3.5 text-xs gap-1.5',
    md: 'h-11 px-5 text-sm gap-2', // 44px height per spec
    lg: 'h-13 px-6 text-base gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-primary to-secondary text-[#070B14] font-semibold hover:opacity-95 shadow-glow hover:shadow-lg hover:shadow-primary/20',
    secondary:
      'bg-bg-elev border border-border text-text-main hover:bg-bg-elev-2 hover:border-primary/40',
    ghost:
      'bg-transparent text-text-muted hover:text-text-main hover:bg-bg-elev-2',
    danger:
      'bg-danger/10 border border-danger/30 text-danger hover:bg-danger/20',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        Icon && <Icon className="w-4 h-4 shrink-0" />
      )}
      <span>{children}</span>
      {!loading && IconRight && <IconRight className="w-4 h-4 shrink-0" />}
    </button>
  );
}
