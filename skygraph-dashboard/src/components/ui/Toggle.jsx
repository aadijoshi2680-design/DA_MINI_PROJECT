import React from 'react';

/**
 * Design system Toggle switch component
 */
export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = '',
  id,
}) {
  const toggleId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <label
      htmlFor={toggleId}
      className={`inline-flex items-center gap-3 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          id={toggleId}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange && onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out border ${
            checked
              ? 'bg-primary/20 border-primary'
              : 'bg-bg-elev-2 border-border'
          }`}
        />
        <div
          className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full transition-transform duration-200 ease-in-out ${
            checked
              ? 'translate-x-5 bg-primary shadow-glow'
              : 'translate-x-0 bg-text-muted/60'
          }`}
        />
      </div>
      {(label || description) && (
        <div className="flex flex-col text-left">
          {label && <span className="text-xs sm:text-sm font-medium text-text-main">{label}</span>}
          {description && <span className="text-[11px] text-text-muted">{description}</span>}
        </div>
      )}
    </label>
  );
}

/**
 * Design system Select dropdown component
 */
export function Select({
  value,
  onChange,
  options = [],
  label,
  disabled = false,
  className = '',
  id,
}) {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`inline-flex flex-col gap-1 text-left ${className}`}>
      {label && (
        <label htmlFor={selectId} className="text-xs font-medium text-text-muted">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange && onChange(e.target.value)}
          className="appearance-none h-10 w-full bg-bg-elev border border-border hover:border-primary/40 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-3.5 pr-8 text-xs font-medium text-text-main transition-colors outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {options.map((opt) => (
            <option
              key={opt.value ?? opt}
              value={opt.value ?? opt}
              className="bg-bg-elev text-text-main"
            >
              {opt.label ?? opt}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-text-muted">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
