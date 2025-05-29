// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
	"./components/**/*.{js,vue,ts}",
	"./layouts/**/*.vue",
	"./pages/**/*.vue",
	"./plugins/**/*.{js,ts}",
	"./nuxt.config.{js,ts}",
	"./app.vue",
  ],
  theme: {
	extend: {
	  // Add custom theme extensions here if needed (colors, fonts)
	  // Example:
	  // colors: {
	  //   'brand-primary': '#007bff', // Example primary color
	  //   'brand-secondary': '#6c757d',
	  // },
	},
  },
  plugins: [
	require('@tailwindcss/forms'), // Optional: for better default form styling
  ],
}
