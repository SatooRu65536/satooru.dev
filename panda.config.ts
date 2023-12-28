import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // global styles
  globalCss: {
    "*": {
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
    },
    body: {
      backgroundColor: "secoundary.100",
    },
  },

  // Useful for theme customization
  theme: {
    tokens: {
      colors: {
        primary: {
          100: { value: "#DDF5F7" },
          200: { value: "#C0D9E5" },
          300: { value: "#44679F" },
          400: { value: "#3B577D" },
        },
        secoundary: {
          100: { value: "#FEFEFE" },
          900: { value: "#333333" },
        },
      },
      fontSizes: {
        sm: { value: "16px" },
      },
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
});
