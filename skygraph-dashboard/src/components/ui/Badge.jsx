import React from 'react';

/**
 * Design system Badge component
 * Variants: tech (grey), status (green), rank (amber), primary (cyan), danger (rose)
 */
export default function Badge({
  children,
  variant = 'tech', // 'tech' | 'status' | 'rank' | 'primary' | 'danger'
  size = 'md', // 'sm' | 'md'
  icon: Icon,
  className = '',
}) {
  const baseStyles = 'inline-flex items-center gap-1.5 font-medium rounded-full tracking-wide select-none';

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1', // 12px text per spec
  };

  const variantStyles = {
    tech: 'bg-bg-elev-2 text-text-muted border border-border',
    status: 'bg-success/15 text-success border border-success/30',
    rank: 'bg-accent/15 text-accent border border-accent/30 font-semibold',
    primary: 'bg-primary/15 text-primary border border-primary/30',
    danger: 'bg-danger/15 text-danger border border-danger/30',
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
