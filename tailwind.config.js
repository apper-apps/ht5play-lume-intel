/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#14213D',
          DEFAULT: '#1E3A5F',
          light: '#2A4A70'
        },
        accent: {
          DEFAULT: '#FCA311',
          light: '#FFB84A',
          dark: '#E6920F'
        },
        surface: {
          DEFAULT: '#1A1F2E',
          light: '#252B3A',
          dark: '#0D1117'
        },
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.1)',
          light: 'rgba(255, 255, 255, 0.15)',
          dark: 'rgba(255, 255, 255, 0.05)'
        }
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif']
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glow': '0 0 20px rgba(252, 163, 17, 0.3)',
        'glow-strong': '0 0 30px rgba(252, 163, 17, 0.5)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(252, 163, 17, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(252, 163, 17, 0.4)' }
        }
      }
    },
  },
  plugins: [],
}