/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        em:   '#10B981',   // emerald — primary accent
        cyan: '#22D3EE',   // cyan — secondary highlight (from Amused Group M)
        lime: '#A3E635',   // lime — tertiary
        bg:   '#020B07',   // near-black background
        bg2:  '#060F0A',
        bg3:  '#091510',
        dim:  '#6B7280',   // muted text
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body:    ['var(--font-body)', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      letterSpacing: {
        'widest2': '0.2em',
        'widest3': '0.3em',
      },
      animation: {
        'blink':     'blink 1s step-end infinite',
        'pulse-dot': 'pulse-dot 1.8s ease-in-out infinite',
        'marquee':   'marquee 20s linear infinite',
        'fade-up':   'fade-up 0.6s ease both',
      },
      keyframes: {
        blink:       { '50%': { opacity: '0' } },
        'pulse-dot': { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.35' } },
        marquee:     { to: { transform: 'translateX(-50%)' } },
        'fade-up':   { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'none' } },
      },
    },
  },
  plugins: [],
};
