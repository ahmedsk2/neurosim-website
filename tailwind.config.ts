import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx,mdx}',
    './src/components/**/*.{ts,tsx,mdx}',
    './src/content/**/*.{md,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          darker: 'var(--bg-darker)',
          dark: 'var(--bg-dark)',
          card: 'var(--bg-card)',
          deeper: 'var(--bg-deeper)',
        },
        line: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
        },
        brand: {
          teal: 'var(--teal)',
          tealLight: 'var(--teal-light)',
          tealDark: 'var(--teal-dark)',
          amber: 'var(--amber)',
          amberLight: 'var(--amber-light)',
          purple: 'var(--purple)',
          blue: 'var(--blue)',
        },
        status: {
          good: 'var(--green)',
          warn: 'var(--amber)',
          danger: 'var(--red-strong)',
          dangerText: 'var(--red)',
        },
        ink: {
          DEFAULT: 'var(--text)',
          muted: 'var(--muted)',
          dim: 'var(--muted-dark)',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      maxWidth: {
        prose: '70ch',
        page: '1500px',
      },
      letterSpacing: {
        eyebrow: '0.2em',
      },
      keyframes: {
        'demo-pulse': {
          '0%': { boxShadow: '0 0 0 0 rgba(245, 158, 11, 0.6)' },
          '70%': { boxShadow: '0 0 0 10px rgba(245, 158, 11, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(245, 158, 11, 0)' },
        },
      },
      animation: {
        'demo-pulse': 'demo-pulse 2s ease-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
