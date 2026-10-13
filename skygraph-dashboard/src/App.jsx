import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Plane } from 'lucide-react';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import RouteTracker from './analytics/RouteTracker';

// Lazy-load page chunks for optimal bundle performance
const Home = lazy(() => import('./pages/Home'));
const Analytics = lazy(() => import('./pages/Analytics'));
const RouteExplorer = lazy(() => import('./pages/RouteExplorer'));
const KitPreview = lazy(() => import('./pages/KitPreview'));

/**
 * Fallback loading spinner
 */
function PageLoadingFallback() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-glow animate-pulse">
        <Plane className="w-6 h-6 -rotate-45" />
      </div>
      <span className="text-xs font-mono text-text-muted tracking-wider uppercase">
        Loading SkyGraph…
      </span>
    </div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-bg text-text-main selection:bg-primary/20 selection:text-primary">
      {/* Accessibility Skip-To-Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] px-4 py-2 bg-primary text-[#070B14] font-heading font-bold rounded-xl shadow-glow outline-none ring-2 ring-white"
      >
        Skip to main content
      </a>

      {/* Google Analytics 4 Route & PageView Tracker */}
      <RouteTracker />

      {/* Sticky Blurred Navbar */}
      <Navbar />
      
      {/* Route Content Shell with Animated Page Transitions */}
      <div id="main-content" className="flex-1 flex flex-col focus:outline-none" tabIndex={-1}>
        <Suspense fallback={<PageLoadingFallback />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/explorer" element={<RouteExplorer />} />
              {/* Hidden UI Kit review page */}
              <Route path="/__kit" element={<KitPreview />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
