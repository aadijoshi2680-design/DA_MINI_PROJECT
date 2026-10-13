import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, initGA } from './ga';

const ROUTE_TITLES = {
  '/': 'SkyGraph — Global Airline Network Dashboard',
  '/analytics': 'SkyGraph — Network Analytics & Hub Rankings',
  '/explorer': 'SkyGraph — Interactive Route Explorer',
  '/__kit': 'SkyGraph — Design System & UI Kit Preview',
};

/**
 * RouteTracker listens to SPA location changes and dispatches page_view events to GA4
 */
export default function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    const title = ROUTE_TITLES[location.pathname] || 'SkyGraph Dashboard';
    document.title = title;
    trackPageView(location.pathname, title);
  }, [location.pathname]);

  return null;
}
