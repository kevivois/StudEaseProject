/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#7fba3c',
          DEFAULT: '#006666',
          dark: '#004f4f',
        },
        secondary: {
          light: '#008080',
          DEFAULT: '#008080',
          dark: '#006666',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))',
      },
    },
  },
  plugins: [],
};