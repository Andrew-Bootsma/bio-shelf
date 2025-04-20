/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Space Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        brand: {
          DEFAULT: "#6B76FF",
          muted: "#D8D9F2",
        },
      },
      boxShadow: {
        hard: "2px 2px 0 black",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
