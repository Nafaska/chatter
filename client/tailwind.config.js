const plugin = require("tailwindcss/plugin");

// console.log(plugin)

module.exports = {
  ppurge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      backgroundColor: ["group-focus"],
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".no-overflow-anchoring": {
          overflowAnchor: "none",
        },
        ".auto-overflow-anchoring": {
          overflowAnchor: "auto",
        },
      });
    }),
  ],
};
