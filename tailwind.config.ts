import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#C8141C',
          orange: '#E5611B',
          orangeLight: '#F08A2E',
          bg: '#FFFAF4',
          ink: '#231510',
          inkSoft: '#8B6E62',
          dash: '#F0E2D2',
          badge: '#FFF1E5',
          badgeStrong: '#FFE0CC',
          green: '#3DDC84',
          line: '#F5E6D6',
          rose: '#B0867A',
        },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 0 40px rgba(0,0,0,0.06)',
        logo: '0 8px 22px rgba(0,0,0,0.18)',
        thumb: '0 6px 14px rgba(35,21,16,0.12)',
        chip: '0 2px 8px rgba(200,20,28,0.18)',
      },
      borderRadius: {
        hero: '28px',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.35)', opacity: '0.65' },
        },
      },
      animation: {
        pulseDot: 'pulseDot 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
