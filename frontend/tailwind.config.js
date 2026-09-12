/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17233c",
        teal: "#0f8b83",
        paper: "#f7f9fc",
      },
      boxShadow: {
        soft: "0 10px 35px rgba(23, 35, 60, 0.08)",
      },
    },
  },
  plugins: [],
};
