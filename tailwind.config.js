/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0f2736',
          gold: '#b98745',
          sage: '#6b8d80',
          cream: '#f8f5ef',
          ink: '#1f2937',
        },
      },
      boxShadow: {
        soft: '0 20px 45px -15px rgba(15, 39, 54, 0.18)',
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(circle at top left, rgba(185,135,69,0.22), transparent 32%), radial-gradient(circle at bottom right, rgba(107,141,128,0.18), transparent 25%)',
      },
    },
  },
  plugins: [],
}
