/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        field: { 50: '#EEF5EA', 100: '#DCEBD3', 200: '#B9D7A9', 600: '#2F6B3A', 700: '#25562E', 800: '#1B4023' },
        turmeric: { 100: '#FBEFC9', 500: '#E3A008', 600: '#C48A06' },
        soil: { 600: '#5B4636', 700: '#463629' },
        paddy: '#F6F8F1',
        ink: '#1E2B22',
      },
      fontFamily: {
        display: ['Bitter', 'Georgia', 'serif'],
        sans: ['Mukta', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
