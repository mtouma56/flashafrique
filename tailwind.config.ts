import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        bg: 'hsl(var(--bg) / <alpha-value>)',
        card: 'hsl(var(--card) / <alpha-value>)',
        fg: 'hsl(var(--fg) / <alpha-value>)',
        muted: 'hsl(var(--muted) / <alpha-value>)',
        accent: 'hsl(var(--accent) / <alpha-value>)',
        'accent-2': 'hsl(var(--accent-2) / <alpha-value>)',
        error: 'hsl(var(--error) / <alpha-value>)',
      },
      fontFamily: {
        serif: ['Merriweather', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'fluid-h1': 'clamp(2.2rem, 1.6rem + 1.8vw, 3.2rem)',
        'fluid-h2': 'clamp(1.8rem, 1.4rem + 1.2vw, 2.4rem)',
        'fluid-h3': 'clamp(1.4rem, 1.2rem + 0.8vw, 1.8rem)',
      },
      letterSpacing: {
        'tighter-editorial': '-0.02em',
        'tight-editorial': '-0.01em',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
