import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'forest-green': {
          DEFAULT: '#2D5016',
          50: '#EBF2E3',
          100: '#D6E4C7',
          200: '#ADCA8F',
          300: '#84AF57',
          400: '#5B951F',
          500: '#4A7C2F',
          600: '#3A6323',
          700: '#2D5016',
          800: '#1F380F',
          900: '#111F07',
        },
        'earth-brown': {
          DEFAULT: '#6B4423',
          50: '#F5EDE5',
          100: '#EBDBCB',
          200: '#D7B797',
          300: '#C39363',
          400: '#A0724E',
          500: '#6B4423',
          600: '#553518',
          700: '#40270E',
          800: '#2A1908',
          900: '#150C04',
        },
        'cream-fog': {
          DEFAULT: '#F5F0E8',
          50: '#FDFBF7',
          100: '#F5F0E8',
          200: '#E8DFD0',
          300: '#DACEBC',
          400: '#CCBDA8',
        },
        'carrot-orange': {
          DEFAULT: '#E8621A',
          50: '#FEF0E7',
          100: '#FCE0CE',
          200: '#F9C19E',
          300: '#F6A26D',
          400: '#F4853D',
          500: '#E8621A',
          600: '#C25115',
          700: '#9B4010',
          800: '#74300B',
          900: '#4D2007',
        },
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
        jakarta: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #1a3009 0%, #2D5016 40%, #4A7C2F 70%, #6B4423 100%)',
        'section-gradient': 'linear-gradient(180deg, #F5F0E8 0%, #FDFBF7 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(45,80,22,0.05) 0%, rgba(107,68,35,0.05) 100%)',
      },
      boxShadow: {
        'green-lg': '0 20px 40px rgba(45, 80, 22, 0.15)',
        'green-md': '0 10px 25px rgba(45, 80, 22, 0.1)',
        'card': '0 4px 20px rgba(107, 68, 35, 0.08)',
        'card-hover': '0 20px 40px rgba(45, 80, 22, 0.15)',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
