import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        accent: '#ff6a00',
        grid: '#e8e8e8'
      },
      fontFamily: {
        sans: ['var(--font-halvar-mittel)']
      }
    }
  },
  plugins: []
};

export default config;
