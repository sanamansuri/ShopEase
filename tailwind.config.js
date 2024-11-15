/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        olive: {
          500: '#009999', // Olive green color
        },
        cyan: {
          500: '#00ffff', // Bright cyan color
        },
      },
    },
  },
  plugins: [],
}
