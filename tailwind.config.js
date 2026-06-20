/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F4F7F9",
        surface: "#FFFFFF",
        ink: "#16242F",
        muted: "#6B7E8C",
        border: "#E3E9ED",

        histology: "#1D6FA5",
        histologySoft: "#EAF3FA",

        pharm: "#3FA77E",
        pharmSoft: "#EAF6F0",

        quiz: "#C97A3A",
        quizSoft: "#FBF0E6",

        fav: "#B9436B",
        favSoft: "#FBEAF0",
      },
      fontFamily: {
        sans: ["Vazirmatn", "Tahoma", "sans-serif"],
      },
    },
  },
  plugins: [],
};
