/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      Baloo: ['"Baloo Tamma 2"', "cursive"],
    },
    extend: {
      colors: {
        "dark-cl": "#433650",
        "gray-cl": "#D9D9D9",
        "light-gray-cl": "#ECE8E8",
        "blue-cl": "#67B9D3",
        "red-cl": "#C84D46",
        "metal-cl": "#CACACA",
        'podium-color': '#E0E4E5',
        'disabled-color': '#C7C7C7',
        'win-color': '#4B7605',
        'lose-color': '#8A0000',
        },
      screens: {
        "xs": "420px",
      },
    },
  },
  plugins: [
	require("tailwind-scrollbar")({ nocompatible: true }),
],
};
