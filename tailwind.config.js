/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['"Black Ops One"', 'cursive'],
        'body': ['"Chakra Petch"', 'sans-serif'],
      },
      colors: {
        // New FastLandz brand colors matching logo
        'cyan': '#00d9ff',        // Primary - bright cyan glow
        'cyan-dark': '#06b6d4',   // Darker cyan variant
        'pink': '#ff3366',        // Accent - pink/red glow
        'pink-dark': '#ef4444',   // Darker pink variant

        // Keep these for specific states
        'void': '#0c0a09',        // Deep black background
        'metal': '#44403c',       // Dark gray accents
        'toxic': '#65a30d',       // Green for "burning fat" state

        // Legacy names mapped to new colors (for gradual migration)
        'rust': '#00d9ff',        // Now cyan
        'dust': '#06b6d4',        // Now dark cyan
        'blood': '#ff3366',       // Now pink
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 217, 255, 0.3)',
        'glow-cyan-lg': '0 0 50px rgba(0, 217, 255, 0.3)',
        'glow-pink': '0 0 20px rgba(255, 51, 102, 0.3)',
        'glow-pink-lg': '0 0 50px rgba(255, 51, 102, 0.3)',
      }
    },
  },
  plugins: [],
}
