/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      spacing: { 
        '13': '3.25rem', 
        '128': '32rem', 
      },
    },
  },
  plugins: [
  ],
}