/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/*.{html,js,css} ",
    "./views/index.ejs",
    "./views/admin/*.ejs",
    "./views/layout/*.ejs",
  ],
  theme: {
    extend: {
      screens: {
        'xs': "200",
        'sm': '200px',
        // => @media (min-width: 640px) { ... }
        'md': '740px',
        // => @media (min-width: 768px) { ... }

        'lg': '1024px',
        // => @media (min-width: 1024px) { ... }

        'xl': '1290px',
        // => @media (min-width: 1280px) { ... }

        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }
      },
    },
  },
  plugins: [
    {
      tailwindcss: {},
      autoprefixer: {},
    },
  ],
};