import React from 'react';
import { HelpCircle } from 'lucide-react';
import Button from './Button';

/**
 * Design system EmptyState component
 * Specs: icon in container, title, hint, optional CTA action
 */
export default function EmptyState({
  icon: Icon = HelpCircle,
  title = 'No data available',
  description = 'There are no records matching your current filter criteria.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-dashed border-border/80 bg-bg-elev/40 ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-bg-elev-2 border border-border flex items-center justify-center text-text-muted mb-4 shadow-sm">
        <Icon className="w-6 h-6 text-primary/70" />
      </div>
      <h3 className="font-heading font-semibold text-text-main text-base sm:text-lg mb-1">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-text-muted max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
