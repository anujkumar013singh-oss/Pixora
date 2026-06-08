/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        'surface-1': '#0a0a0a',
        'surface-2': '#111111',
        'surface-3': '#1a1a1a',
        'border-dim': '#2a2a2a',
        muted: '#888888',
        accent: {
          DEFAULT: '#0057FF',
          dark: '#0052CC',
          light: '#3385FF',
          dim: '#0057FF22',
        },
      },
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
