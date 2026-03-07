/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        /* Navigation */
        nav: '#1A1C1E',
        /* Surfaces */
        base: '#F7F7F5',
        surface: '#FFFFFF',
        card: '#FFFFFF',
        'card-hover': '#F2F2F0',
        /* Accents */
        accent: '#2B4C7E',
        'accent-hover': '#1F3A6B',
        gold: '#C7A46C',
        emerald: '#3F7D6A',
        terracotta: '#B35C44',
        amber: '#B8893A',
        slate: '#3B6EA8',
      },
      borderColor: {
        DEFAULT: '#E3E4E6',
        bright: '#CCCECF',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        elevated: '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        modal: '0 12px 32px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
}
