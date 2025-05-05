import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        'modal-down': {
          '0%': { opacity: '0', transform: 'translateY(-500px)' },
          '90%': { opacity: '1', transform: 'translateY(5px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'loading': {
          '0%': { marginLeft: '0', width: '0' },
          '50%': { marginLeft: '0', width: '100%' },
          '100%': { marginLeft: '100%', width: '0' }
        },
        'transform-from-end': {
          'from': { transform: 'translateX(100%)' },
        },
        'transform-from-start': {
          'from': { transform: 'translateX(-100%)' },
        },
        'transform-from-bottom': {
          'from': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        'modal-down': 'modal-down 0.8s normal',
        'loading': 'loading 1s ease infinite',
        'transform-from-end': 'transform-from-end 250ms ease',
        'transform-from-start': 'transform-from-start 250ms ease' ,
        'transform-from-bottom': 'transform-from-bottom 250ms ease'
      },
    },
  },
  plugins: [],
} satisfies Config;
