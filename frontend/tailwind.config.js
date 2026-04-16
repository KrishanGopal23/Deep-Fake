/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#f6fbff',
          panel: '#ffffff',
          line: 'rgba(14, 165, 233, 0.12)',
          muted: '#64748b',
          accent: '#38bdf8',
          emerald: '#10b981',
          rose: '#f43f5e',
          ink: '#0f172a',
        },
      },
      fontFamily: {
        body: ['Manrope', 'sans-serif'],
        display: ['Sora', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 24px 60px rgba(56, 189, 248, 0.22)',
        panel: '0 24px 70px rgba(148, 163, 184, 0.18)',
      },
      backgroundImage: {
        'hero-radial':
          'radial-gradient(circle at 12% 18%, rgba(56, 189, 248, 0.24), transparent 24%), radial-gradient(circle at 86% 16%, rgba(251, 113, 133, 0.18), transparent 22%), radial-gradient(circle at 50% 100%, rgba(16, 185, 129, 0.16), transparent 26%), linear-gradient(180deg, #fbfdff 0%, #f3fbff 46%, #fdfefe 100%)',
      },
      animation: {
        float: 'float 12s ease-in-out infinite',
        pulseSoft: 'pulseSoft 3.2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
