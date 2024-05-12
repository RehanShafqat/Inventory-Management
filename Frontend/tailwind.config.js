/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Roboto']
      },
      colors: {
        darkModeColor: "#1c2434",
        bgWhite: "#f1f5f9"
      }
    },
  },
  plugins: [],
}

