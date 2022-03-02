module.exports = {
    content: [
        "**/*.ejs",
    ],
    theme: {
        extend: {},
        fontSize: {
          'xs': '12px'
        },
    },
    plugins: [require('@tailwindcss/forms')],
    darkMode: 'class',
}
