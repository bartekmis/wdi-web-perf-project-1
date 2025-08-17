/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-archivo)', 'Trebuchet MS', 'Arial', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-yellow': 'radial-gradient(closest-side at 50% 50%, rgba(0, 0, 0, 0) 0%, var(--yellow) 100%)',
      }
    },
    colors: {
      transparent: 'var(--transparent)',
      white: 'var(--white)',
      black: 'var(--black)',
      blackSecondary: 'var(--blackSecondary)',
      lightGrey: 'var(--lightGrey)',
      lightGreySecondary: 'var(--lightGreySecondary)',
      red: 'var(--red)',
      redSecondary: 'var(--redSecondary)',
      yellow: 'var(--yellow)',
    },
    spacing: {
      '0': '0px',
      '1': '4px',
      '2': '8px',
      '3': '12px',
      '4': '16px',
      '4.5': '18px',
      '5': '20px',
      '6': '24px',
      '8': '30px',
      '9': '36px',
      '12': '48px',
      '16': '60px',
      '20': '72px',
      '24': '96px',
      '32': '120px',
      '36': '144px',
      '48': '180px',
      '54': '210px',
      '60': '244px',
    },
    screens: {
      'sm': '414px',
      'md': '768px',
      'lg': '991px',
      'xl': '1200px',
      '2xl': '1440px',
      '3xl': '1600px',
      '4xl': '1920px',
    },
  },
  safelist: [
    {
      pattern: /bg-/,
      variants: ['xl', 'hover'],
    },
    {
      pattern: /text-/,
      variants: ['group-hover'],
    },
  ],
  plugins: [
    require('@tailwindcss/forms'),
  ],
  corePlugins: {
    container: false,
  }
}
