import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/**
 * Design system KpiCard component
 * Specs from design.md section 6.1 & 7:
 * - Icon in tinted circle
 * - Label (muted)
 * - Big number with animated count-up on first viewport entry (1.2s)
 * - Caption underneath
 * - Hover lifts 4px and intensifies top glow
 */
export default function KpiCard({
  label,
  value, // string or number (e.g. 7658 or "7,658" or 17.6)
  caption,
  icon: Icon,
  variant = 'primary', // 'primary' | 'secondary' | 'accent' | 'success'
  onClick,
  className = '',
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(0);

  // Parse numeric portion for count-up
  const numericVal = typeof value === 'number' ? value : parseFloat(String(value).replace(/,/g, ''));
  const isFloat = !isNaN(numericVal) && String(value).includes('.');

  useEffect(() => {
    if (!isInView || isNaN(numericVal)) return;

    if (shouldReduceMotion) {
      setDisplayValue(numericVal);
      return;
    }

    let startTime = null;
    const duration = 1200; // 1.2s per motion spec

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = ease * numericVal;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(numericVal);
      }
    };

    requestAnimationFrame(step);
  }, [isInView, numericVal, shouldReduceMotion]);

  const formattedDisplay = () => {
    if (isNaN(numericVal)) return value;
    if (isFloat) return displayValue.toFixed(1);
    return Math.round(displayValue).toLocaleString();
  };

  const variantColors = {
    primary: {
      iconBg: 'bg-primary/10 border-primary/30 text-primary',
      glow: 'hover:shadow-[0_0_25px_rgba(34,211,238,0.2)]',
    },
    secondary: {
      iconBg: 'bg-secondary/10 border-secondary/30 text-secondary',
      glow: 'hover:shadow-[0_0_25px_rgba(139,92,246,0.2)]',
    },
    accent: {
      iconBg: 'bg-accent/10 border-accent/30 text-accent',
      glow: 'hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]',
    },
    success: {
      iconBg: 'bg-success/10 border-success/30 text-success',
      glow: 'hover:shadow-[0_0_25px_rgba(52,211,153,0.2)]',
    },
  };

  const styleConfig = variantColors[variant] || variantColors.primary;

  return (
    <motion.div
      ref={ref}
      whileHover={shouldReduceMotion ? {} : { y: -4 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className={`card-glow-top relative rounded-card border border-border bg-bg-elev p-5 sm:p-6 shadow-card transition-all duration-200 ${
        styleConfig.glow
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-medium text-text-muted tracking-wide uppercase">
          {label}
        </span>
        {Icon && (
          <div
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-transform ${styleConfig.iconBg}`}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="text-2xl sm:text-3xl font-heading font-bold text-text-main tracking-tight tabular-nums">
        {formattedDisplay()}
      </div>

      {caption && (
        <div className="mt-2 text-xs text-text-muted flex items-center gap-1.5">
          <span>{caption}</span>
        </div>
      )}
    </motion.div>
  );
}
