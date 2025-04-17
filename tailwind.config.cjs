/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular"],
      },
      colors: {
        brand: {
          DEFAULT: "#6B76FF",
          muted: "#D8D9F2",
        },
        bg: "#ffffff",
        text: "#000000",
        border: "#000000",
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
      },
      boxShadow: {
        hard: "2px 2px 0 black",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
