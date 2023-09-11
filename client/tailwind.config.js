// tailwind.config.js
const { colors: defaultColors } = require('tailwindcss/defaultTheme')

const colors = {
    ...defaultColors,
    ...{
        "green-izzi": "#00BBB4"
    },
}

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: colors,
    extend: {},
  },
  variants: {
    extend: {
        opacity: ['disabled'],
        backgroundColor: ['checked'],
        borderColor: ['checked'],
    },
  },
  plugins: [],
}
