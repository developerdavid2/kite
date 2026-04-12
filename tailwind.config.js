/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./context/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["PlusJakartaSans_400Regular"],
        medium: ["PlusJakartaSans_500Medium"],
        semibold: ["PlusJakartaSans_600SemiBold"],
        jakarta: ["PlusJakartaSans_700Bold"],
      },
      colors: {
        blue: {
          50: "#E8F4FD",
          100: "#BAD9F5",
          200: "#7BB8EA",
          300: "#4A9FE0",
          400: "#2185D5",
          500: "#1A6BB5",
          600: "#144F8A",
          700: "#0D3460",
          800: "#081E3A",
          900: "#040F1E",
        },
      },
    },
  },
  plugins: [],
};
