/**
 * Google Analytics 4 (GA4) Tracker & Debug Logger
 * Adheres to flow.md section 6 and instructions.md Phase 8
 */

const GA_ID = import.meta.env.VITE_GA_ID;
const IS_DEV = import.meta.env.DEV || true; // Keep dev console logs visible per instructions

let isInitialized = false;

/**
 * Initializes GA4 gtag script tag once
 */
export function initGA() {
  if (isInitialized || typeof window === 'undefined') return;

  if (GA_ID && GA_ID !== 'G-XXXXXXXXXX') {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    // Anonymize IP is default in GA4
    gtag('config', GA_ID, {
      anonymize_ip: true,
      send_page_view: false, // Handled manually by RouteTracker
    });
  }

  isInitialized = true;
}

/**
 * Tracks custom interaction events
 * @param {string} eventName 
 * @param {Record<string, any>} params 
 */
export function trackEvent(eventName, params = {}) {
  // Dev debug logging
  if (IS_DEV) {
    console.log(
      `%c[GA4 Event]%c ${eventName}`,
      'background: #22D3EE; color: #070B14; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
      'color: #E6EBF5; font-weight: 500;',
      params
    );
  }

  if (typeof window !== 'undefined' && window.gtag && GA_ID && GA_ID !== 'G-XXXXXXXXXX') {
    window.gtag('event', eventName, params);
  }
}

/**
 * Tracks SPA page views
 * @param {string} pagePath 
 * @param {string} pageTitle 
 */
export function trackPageView(pagePath, pageTitle) {
  if (IS_DEV) {
    console.log(
      `%c[GA4 PageView]%c ${pagePath} — "${pageTitle}"`,
      'background: #8B5CF6; color: #FFFFFF; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
      'color: #E6EBF5;'
    );
  }

  if (typeof window !== 'undefined' && window.gtag && GA_ID && GA_ID !== 'G-XXXXXXXXXX') {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }
}
