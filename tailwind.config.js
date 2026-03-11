/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      colors: {
        /* Navigation */
        nav: '#05070A',
        /* Surfaces */
        base: '#080A0D',
        surface: '#0D1017',
        card: '#0D1017',
        'card-hover': '#121720',
        /* Primary accent — Gold */
        accent: '#C9963D',
        'accent-hover': '#D4A84E',
        gold: '#C9963D',
        'gold-light': '#E8B860',
        /* Status colors — vivid for dark backgrounds */
        emerald: '#3DB87A',
        terracotta: '#E05C4A',
        amber: '#D4924A',
        slate: '#5A9AE0',
        indigo: '#8B7BC8',
      },
      borderColor: {
        DEFAULT: 'rgba(255,255,255,0.055)',
        bright: 'rgba(255,255,255,0.11)',
        gold: 'rgba(201,150,61,0.28)',
      },
      boxShadow: {
        card: '0 1px 4px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.4)',
        elevated: '0 4px 16px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.4)',
        modal: '0 12px 40px rgba(0,0,0,0.7), 0 4px 12px rgba(0,0,0,0.5)',
        gold: '0 0 28px rgba(201,150,61,0.14), 0 4px 16px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}
