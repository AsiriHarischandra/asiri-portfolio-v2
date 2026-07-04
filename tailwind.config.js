/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        em:   '#10B981',
        lime: '#A3E635',
        bg:   '#020B07',
        bg2:  '#060F0A',
        bg3:  '#091510',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body:    ['var(--font-body)', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'blink':   'blink 1s step-end infinite',
        'pulse-dot': 'pulse-dot 1.8s ease-in-out infinite',
        'marquee': 'marquee 20s linear infinite',
      },
      keyframes: {
        blink:     { '50%': { opacity: '0' } },
        'pulse-dot': { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.35' } },
        marquee:   { to: { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [],
};
