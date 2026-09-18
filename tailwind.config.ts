import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        garjane: {
          primary: {
            DEFAULT: '#C01A2A',
            dark: '#A01522',
            light: '#E02030',
            foreground: '#FFFFFF',
          },
          secondary: {
            DEFAULT: '#1A1A2E',
            dark: '#0F0F1A',
            light: '#2D2D4A',
            foreground: '#FFFFFF',
          },
          accent: {
            DEFAULT: '#FFB800',
            dark: '#CC9300',
            light: '#FFCC33',
            foreground: '#1A1A2E',
          },
          background: {
            light: '#FAFAFA',
            dark: '#0D0D14',
            card: '#FFFFFF',
            cardDark: '#1A1A2E',
          },
          text: {
            primary: '#1A1A2E',
            secondary: '#4A4A5A',
            muted: '#7A7A8A',
            inverse: '#FFFFFF',
            link: '#C01A2A',
          },
          border: {
            light: '#E5E5E5',
            dark: '#2D2D4A',
          },
          breaking: {
            bg: '#FEF2F2',
            text: '#991B1B',
            bgDark: '#450A0A',
            textDark: '#FCA5A5',
          },
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        kannada: ['var(--font-noto-sans-kannada)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-lexend)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'headline-1': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-2': ['clamp(1.75rem, 3.5vw, 2.5rem)', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'headline-3': ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-4': ['clamp(1.25rem, 2.5vw, 1.5rem)', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.65', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],
        'overline': ['0.7rem', { lineHeight: '1.4', fontWeight: '600', letterSpacing: '0.08em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
          xl: '3rem',
          '2xl': '4rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1440px',
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'card-elevated': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'breaking': '0 0 0 1px #FCA5A5, 0 4px 6px -1px rgb(220 38 38 / 0.2)',
      },
      animation: {
        'ticker': 'ticker 30s linear infinite',
        'ticker-fast': 'ticker 20s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;