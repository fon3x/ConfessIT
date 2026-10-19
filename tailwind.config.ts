import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'c-black': '#000000',
        'c-brown': '#1A1512',
        'c-brown-light': '#2A2320',
        'c-brown-hover': '#332C28',
        'c-gold': '#D4AF37',
        'c-gold-dim': '#B8962F',
        'c-gold-bright': '#E8C84A',
        // Also support confess-* aliases
        'confess-black': '#000000',
        'confess-brown': '#1A1512',
        'confess-brown-light': '#2A2320',
        'confess-brown-hover': '#332C28',
        'confess-gold': '#D4AF37',
        'confess-gold-dim': '#B8962F',
        'confess-gold-bright': '#E8C84A',
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212,175,55,0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(212,175,55,0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'pulse-gold': 'pulse-gold 2s infinite',
      },
    },
  },
  plugins: [],
};
export default config;
