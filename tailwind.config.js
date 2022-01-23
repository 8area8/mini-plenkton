module.exports = {
  mode: "jit",
  content: [
    "./components/**/*.{vue,js}",
    // "./layouts/**/*.vue",
    // "./pages/**/*.vue",
    // "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./App.vue",
  ],
  theme: {
    extend: {},
    fontFamily: {
      'sans': ['Roboto'],
      'sansTitle': ['RobotoCondensed'],
      'sansThin': ['RobotoThin'],
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
