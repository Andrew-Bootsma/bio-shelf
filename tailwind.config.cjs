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
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
