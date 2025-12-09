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
        primary: '#2563eb', // blue-600
        secondary: '#7c3aed', // purple-600
        accent: '#14b8a6', // teal-500
      },
      boxShadow: {
        soft: '0 10px 30px rgba(37, 99, 235, 0.12)',
      },
    },
  },
  plugins: [],
}

