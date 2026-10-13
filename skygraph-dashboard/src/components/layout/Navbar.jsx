import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Menu, X, Github, Moon, Sun } from 'lucide-react';
import { trackEvent } from '../../analytics/ga';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'Route Explorer', path: '/explorer' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const location = useLocation();

  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
    document.documentElement.classList.toggle('light');
  };

  const handleOutboundClick = (url) => {
    trackEvent('outbound_click', { url });
  };

  return (
    <header className="sticky top-0 z-50 w-full h-16 border-b border-border/80 bg-bg/80 backdrop-blur-md transition-colors">
      <div className="max-w-content mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        
        {/* Logo */}
        <NavLink 
          to="/" 
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg px-1 py-0.5"
          aria-label="SkyGraph Home"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary group-hover:bg-primary/20 group-hover:border-primary/50 transition-all shadow-glow">
            <Plane className="w-4 h-4 transform -rotate-45" />
          </div>
          <span className="font-heading font-bold text-lg sm:text-xl tracking-tight text-text-main group-hover:text-primary transition-colors">
            SkyGraph
          </span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded bg-primary/10 text-primary border border-primary/20">
            Graph Neo4j
          </span>
        </NavLink>

        {/* Desktop Nav - Exactly 3 items */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive: active }) =>
                  `relative px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md ${
                    active ? 'text-primary' : 'text-text-muted hover:text-text-main'
                  }`
                }
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full shadow-[0_0_8px_#22D3EE]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-text-muted hover:text-text-main hover:bg-bg-elev border border-transparent hover:border-border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Toggle visual theme"
            title="Toggle theme"
          >
            {isLightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* GitHub link with GA4 outbound_click event */}
          <a
            href="https://github.com/aadijoshi2680-design/DA_MINI_PROJECT"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleOutboundClick('https://github.com/aadijoshi2680-design/DA_MINI_PROJECT')}
            className="p-2 rounded-lg text-text-muted hover:text-text-main hover:bg-bg-elev border border-transparent hover:border-border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="GitHub Repository"
            title="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-text-muted hover:text-text-main hover:bg-bg-elev border border-border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-border bg-bg-elev px-4 py-4 space-y-1"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center h-12 px-4 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-text-muted hover:text-text-main hover:bg-bg-elev-2'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
