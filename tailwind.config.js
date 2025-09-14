/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Luxury Primary - Deep Purple/Violet
        primary: {
          50: '#faf7ff',
          100: '#f3edff',
          200: '#e9deff',
          300: '#d6c1ff',
          400: '#bb99ff',
          500: '#9d66ff',
          600: '#8b44ff',
          700: '#7c2eff',
          800: '#6818f5',
          900: '#5611c9',
        },
        // Luxury Secondary - Rose Gold
        secondary: {
          50: '#fef7f3',
          100: '#fdebe4',
          200: '#fbd5c9',
          300: '#f7b6a3',
          400: '#f18c6d',
          500: '#e86c47',
          600: '#d1502b',
          700: '#b23f20',
          800: '#93361e',
          900: '#792f1e',
        },
        // Accent - Emerald
        accent: {
          50: '#ecfff5',
          100: '#d1ffea',
          200: '#a6ffd6',
          300: '#6bffb7',
          400: '#29ff94',
          500: '#00e876',
          600: '#00c260',
          700: '#009b4f',
          800: '#067943',
          900: '#096238',
        },
        // Luxury Grays - Warmer tones
        luxury: {
          50: '#fefefe',
          100: '#fcfcfc',
          200: '#f8f8f8',
          300: '#f0f0f0',
          400: '#e0e0e0',
          500: '#c8c8c8',
          600: '#a0a0a0',
          700: '#787878',
          800: '#505050',
          900: '#282828',
        },
        // Dark theme
        dark: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'luxury-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'luxury': '0 10px 40px -10px rgba(0, 0, 0, 0.25)',
        'luxury-lg': '0 20px 60px -10px rgba(0, 0, 0, 0.3)',
        'inner-glow': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
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