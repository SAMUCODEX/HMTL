/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./componentes.html",
    "./prototipo.html",
    "./src/**/*.{html,js,css}",
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#10b981',
          accent: '#34d399',
          dark: '#020617',
          surface: '#0f172a',
        },
        'verde-ruta': '#10b981',
        'naranja-pedal': '#f39a2b',
        'azul-noche': '#020617',
      },
      fontFamily: {
        sans: ['"Open Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        heading: ['"Montserrat"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

