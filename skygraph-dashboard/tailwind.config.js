/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-elev': 'var(--bg-elev)',
        'bg-elev-2': 'var(--bg-elev-2)',
        border: 'var(--border)',
        'text-main': 'var(--text)',
        'text-muted': 'var(--text-muted)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        success: 'var(--success)',
        danger: 'var(--danger)',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      maxWidth: {
        content: '1280px',
      },
      borderRadius: {
        card: '16px',
      },
      boxShadow: {
        card: '0 8px 30px rgba(0, 0, 0, 0.35)',
        glow: '0 0 25px -5px rgba(34, 211, 238, 0.25)',
      },
    },
  },
  plugins: [],
}
