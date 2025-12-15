/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['"Black Ops One"', 'cursive'],
        'body': ['"Chakra Petch"', 'sans-serif'],
      },
      colors: {
        'rust': '#c2410c',
        'dust': '#ca8a04',
        'void': '#0c0a09',
        'metal': '#44403c',
        'blood': '#991b1b',
        'toxic': '#65a30d',
      }
    },
  },
  plugins: [],
}
