/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        navy: '#1B0750',
        brand: {
          purple: '#7C3AED',
          deep: '#5C2ED4',
          magenta: '#A614C3',
          light: '#F3F0FF',
        },
      },
    },
  },
  plugins: [],
}
