/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'sm': '640px',   // Small screens (default Tailwind)
        'md': '768px',   // Medium screens (default Tailwind)
        'lg': '1024px',  // Large screens (default Tailwind)
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
  variants: {
    scrollbar: ['rounded'],
  },
}
