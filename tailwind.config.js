/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0f2736',
          'navy-deep': '#0a1c28',
          gold: '#b98745',
          'gold-soft': '#c9a06a',
          sage: '#6b8d80',
          cream: '#f8f5ef',
          'cream-dark': '#efeae1',
          ink: '#1f2937',
          muted: '#64748b',
          border: '#e2e8f0',
        },
      },
      fontFamily: {
        display: [
          'Fraunces',
          'Georgia',
          'Times New Roman',
          'serif',
        ],
        sans: [
          'DM Sans',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
      fontSize: {
        'display-xl': [
          'clamp(2.25rem, 4vw + 1rem, 3.75rem)',
          { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '600' },
        ],
        'display-lg': [
          'clamp(1.875rem, 2.5vw + 1rem, 2.75rem)',
          { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '600' },
        ],
        'display-md': [
          'clamp(1.5rem, 1.5vw + 1rem, 2rem)',
          { lineHeight: '1.2', letterSpacing: '-0.015em', fontWeight: '600' },
        ],
      },
      maxWidth: {
        content: '72rem',
        narrow: '42rem',
      },
      boxShadow: {
        soft: '0 20px 45px -15px rgba(15, 39, 54, 0.18)',
        card: '0 10px 30px -12px rgba(15, 39, 54, 0.12)',
      },
      borderRadius: {
        card: '1.5rem',
        section: '2rem',
      },
      backgroundImage: {
        'hero-glow':
          'radial-gradient(circle at top left, rgba(185,135,69,0.22), transparent 32%), radial-gradient(circle at bottom right, rgba(107,141,128,0.18), transparent 25%)',
      },
    },
  },
  plugins: [],
}
