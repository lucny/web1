/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ink: '#102A43',
        night: '#071B31',
        brand: '#0E7490',
        accent: '#F59E0B',
        paper: '#F7FAFC',
        mist: '#E6F1F5'
      },
      boxShadow: {
        lift: '0 20px 45px -28px rgb(7 27 49 / 42%)'
      },
      fontFamily: {
        display: ['"DM Sans"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
