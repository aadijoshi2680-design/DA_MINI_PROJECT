import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Analytics from './pages/Analytics';
import RouteExplorer from './pages/RouteExplorer';
import KitPreview from './pages/KitPreview';

export default function App() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-bg text-text-main selection:bg-primary/20 selection:text-primary">
      <Navbar />
      
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/explorer" element={<RouteExplorer />} />
            {/* Hidden UI Kit review page for testing Phase 3 primitives */}
            <Route path="/__kit" element={<KitPreview />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}
