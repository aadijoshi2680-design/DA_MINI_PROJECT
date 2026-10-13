import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function PageShell({ children, title, subtitle, className = '' }) {
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    initial: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 12,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.25,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : -8,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.15,
      },
    },
  };

  return (
    <motion.main
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`relative min-h-[calc(100vh-4rem-120px)] w-full py-8 md:py-10 ${className}`}
    >
      {/* Background radial glow ambience */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 bg-radial-glow overflow-hidden" 
        aria-hidden="true" 
      />

      <div className="relative z-10 max-w-content mx-auto px-4 sm:px-6">
        {(title || subtitle) && (
          <header className="mb-8">
            {title && (
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold tracking-tight text-text-main">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-2 text-sm sm:text-base text-text-muted max-w-3xl">
                {subtitle}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </motion.main>
  );
}
