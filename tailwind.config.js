/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        hero: {
          DEFAULT: "#F3CCC5",
          deep: "#E3ACA5",
          light: "#FAD8CF",
        },
        surface: "#FEFEFE",
        ink: "#161010",
        category: {
          malva: "#DCC3D6",
          sage: "#C4DFD0",
          salmon: "#F3CEC6",
          polvo: "#CED7E3",
          arena: "#F0DBBE",
          aqua: "#C2E1DC",
        },
      },
      fontFamily: {
        display: ["Montserrat", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        logotype: ["EB Garamond", "serif"],
      },
      fontSize: {
        logo: ["24px", { lineHeight: "1.2" }],
        nav: ["16px", { lineHeight: "1.4" }],
        hero: ["clamp(2rem, 5vw, 3rem)", { lineHeight: "1.1" }],
        eyebrow: ["20px", { lineHeight: "1.4", letterSpacing: "0.2em" }],
        "card-title": ["19px", { lineHeight: "1.3" }],
        button: ["14px", { lineHeight: "1.4" }],
      },
      spacing: {
        4.5: "18px",
      },
      borderRadius: {
        card: "20px",
      },
      aspectRatio: {
        card: "1 / 1.2",
      },
      boxShadow: {
        card: "0 4px 16px -4px rgb(22 16 16 / 0.12)",
        "card-hover": "0 12px 28px -6px rgb(22 16 16 / 0.2)",
      },
    },
  },
  plugins: [],
};
