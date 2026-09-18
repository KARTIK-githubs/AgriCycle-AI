/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#FBF9F4',
          100: '#F3EFE6',
          200: '#E7E0D0',
          300: '#D8CEBA',
        },
        soil: {
          900: '#1C1D18',
          800: '#2A2C24',
          700: '#3A3C34',
          600: '#54574C',
          500: '#73776A',
          400: '#9BA092',
          100: '#ECEEEA',
        },
        agri: {
          forest: {
            DEFAULT: '#265337',
            50: '#EBF2ED',
            100: '#D7E5DC',
            600: '#265337',
            700: '#1F432C',
            800: '#173322',
            900: '#0F2217',
          }
        },
        harvest: {
          amber: {
            DEFAULT: '#B85D2A',
            50: '#FDF3EC',
            100: '#FBE6D9',
            600: '#B85D2A',
            700: '#984B20',
          }
        },
        clay: {
          DEFAULT: '#8F391B',
          light: '#FBECE8',
        },
        field: {
          border: '#D8D2C4',
          'border-dark': '#B5ACA0',
        }
      },
      fontFamily: {
        serif: ['Lora', 'Newsreader', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'ledger': '0 1px 2px rgba(28, 29, 24, 0.04)',
        'ledger-hover': '0 2px 4px rgba(28, 29, 24, 0.08)',
      }
    },
  },
  plugins: [],
}
