import React from 'react';
import { Info, AlertCircle, RefreshCw, Download } from 'lucide-react';
import Tooltip from './Tooltip';
import Skeleton from './Skeleton';
import EmptyState from './EmptyState';
import Button from './Button';

/**
 * Design system ChartCard component
 * Specs from design.md section 6.2 & 7:
 * - Title (H3)
 * - Insight subtitle (generated from data)
 * - "i" info tooltip explaining Neo4j graph metric / query
 * - Loading skeleton shimmer
 * - Error state with retry button
 * - Empty state fallback
 * - aria-label summarizing chart insight
 */
export default function ChartCard({
  title,
  subtitle,
  info,
  loading = false,
  error = null,
  empty = false,
  onRetry,
  onDownload,
  minHeight = '320px',
  children,
  className = '',
  actionRight,
}) {
  return (
    <div
      className={`rounded-card border border-border bg-bg-elev p-5 sm:p-6 shadow-card flex flex-col justify-between transition-colors ${className}`}
      role="region"
      aria-label={`${title}: ${subtitle || ''}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-base sm:text-lg font-semibold text-text-main tracking-tight">
              {title}
            </h3>
            {info && (
              <Tooltip content={info} position="top">
                <button
                  type="button"
                  className="text-text-muted hover:text-primary transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-full p-0.5"
                  aria-label={`About ${title}`}
                >
                  <Info className="w-4 h-4" />
                </button>
              </Tooltip>
            )}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {actionRight}
          {onDownload && (
            <Tooltip content="Export chart image" position="left">
              <button
                onClick={onDownload}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-main hover:bg-bg-elev-2 transition-colors border border-transparent hover:border-border"
                aria-label="Download chart"
              >
                <Download className="w-4 h-4" />
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div
        style={{ minHeight }}
        className="relative flex-1 flex flex-col justify-center w-full"
      >
        {loading ? (
          <div className="w-full h-full flex flex-col justify-between gap-3 py-2">
            <Skeleton height="28px" width="40%" />
            <Skeleton height="70%" width="100%" />
            <div className="flex justify-between gap-4">
              <Skeleton height="16px" width="30%" />
              <Skeleton height="16px" width="20%" />
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-6 text-center rounded-xl bg-danger/5 border border-danger/20 my-auto">
            <AlertCircle className="w-8 h-8 text-danger mb-2" />
            <h4 className="text-sm font-semibold text-text-main mb-1">
              Failed to load chart data
            </h4>
            <p className="text-xs text-text-muted max-w-xs mb-4">
              {error}
            </p>
            {onRetry && (
              <Button
                variant="secondary"
                size="sm"
                icon={RefreshCw}
                onClick={onRetry}
              >
                Retry
              </Button>
            )}
          </div>
        ) : empty ? (
          <EmptyState
            title="No chart data available"
            description="There are currently no network records for the chosen filter configuration."
            className="my-auto border-none bg-transparent"
          />
        ) : (
          <div className="w-full h-full flex-1" role="img" aria-label={subtitle || title}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
