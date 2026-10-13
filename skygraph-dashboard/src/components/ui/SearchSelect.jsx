import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Check, MapPin } from 'lucide-react';

/**
 * Design system SearchSelect autocomplete component
 * Specs from design.md section 6.3 & 7:
 * - Leading search icon
 * - Dropdown max 8 rows
 * - Highlighted query match text
 * - Keyboard navigable (Up/Down arrows, Enter, Escape)
 * - Accessible combobox
 */
export default function SearchSelect({
  items = [], // Array of objects or strings, e.g. { id, label, sublabel, iata }
  value = null,
  onChange,
  placeholder = 'Search by name, city, or IATA...',
  label,
  disabled = false,
  className = '',
  itemKey = 'id',
  itemLabel = 'label',
  itemSublabel = 'sublabel',
  icon: Icon = Search,
}) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Sync internal input display with external value
  useEffect(() => {
    if (value) {
      const labelText = typeof value === 'object' ? value[itemLabel] || value.name || value.iata : value;
      setQuery(labelText || '');
    } else {
      setQuery('');
    }
  }, [value, itemLabel]);

  // Filter items matching query
  const filteredItems = items
    .filter((item) => {
      if (!query || (value && query === (typeof value === 'object' ? value[itemLabel] : value))) {
        return true;
      }
      const q = query.toLowerCase().trim();
      const name = String(typeof item === 'object' ? item[itemLabel] || item.name || '' : item).toLowerCase();
      const sub = String(typeof item === 'object' ? item[itemSublabel] || item.city || item.country || '' : '').toLowerCase();
      const code = String(typeof item === 'object' ? item.iata || item.icao || item.key || '' : '').toLowerCase();

      return name.includes(q) || sub.includes(q) || code.includes(q);
    })
    .slice(0, 8); // Max 8 rows per spec

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    onChange && onChange(item);
    setIsOpen(false);
    setHighlightedIndex(0);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange && onChange(null);
    setQuery('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredItems[highlightedIndex]) {
          handleSelect(filteredItems[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  // Highlight matching substring
  const renderHighlighted = (text) => {
    if (!query || !text) return text;
    const parts = String(text).split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="text-primary font-semibold underline decoration-primary/50">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div ref={containerRef} className={`relative flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-text-muted">
          {label}
        </label>
      )}

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-text-muted">
          <Icon className="w-4 h-4" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          disabled={disabled}
          placeholder={placeholder}
          aria-expanded={isOpen}
          aria-autocomplete="list"
          role="combobox"
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="h-11 w-full bg-bg-elev-2 border border-border hover:border-primary/40 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl pl-10 pr-9 text-xs sm:text-sm text-text-main transition-colors outline-none disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-text-muted/60"
        />

        {query && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-text-main"
            aria-label="Clear selection"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && (
        <div
          ref={listRef}
          role="listbox"
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-xl border border-border bg-bg-elev p-1.5 shadow-2xl backdrop-blur-md"
        >
          {filteredItems.length === 0 ? (
            <div className="p-3 text-center text-xs text-text-muted">
              No matching destinations found
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const key = typeof item === 'object' ? item[itemKey] || item.iata || idx : item;
              const labelStr = typeof item === 'object' ? item[itemLabel] || item.name : item;
              const sublabelStr = typeof item === 'object' ? item[itemSublabel] || item.city || item.country : null;
              const codeStr = typeof item === 'object' ? item.iata || item.key : null;
              const isSelected = value && (typeof value === 'object' ? value[itemKey] === key : value === item);
              const isHighlighted = idx === highlightedIndex;

              return (
                <div
                  key={key}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                    isHighlighted
                      ? 'bg-bg-elev-2 text-text-main'
                      : 'text-text-muted hover:text-text-main'
                  } ${isSelected ? 'border border-primary/20 bg-primary/5' : ''}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    <div className="truncate">
                      <div className="font-medium text-text-main truncate">
                        {renderHighlighted(labelStr)}
                      </div>
                      {sublabelStr && (
                        <div className="text-[11px] text-text-muted truncate">
                          {renderHighlighted(sublabelStr)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {codeStr && (
                      <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-bg-elev border border-border text-primary">
                        {codeStr}
                      </span>
                    )}
                    {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
