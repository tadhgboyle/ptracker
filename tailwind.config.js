module.exports = {
  content: [
      "**/*.ejs",
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
  darkMode: 'class',
  safelist: [
      'bg-gray-100',
      'bg-amber-100',
      'bg-orange-100',
      'bg-red-100',
  ],
}
