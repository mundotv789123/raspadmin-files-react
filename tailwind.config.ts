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
        }
      },
      animation: {
        'modal-down': 'modal-down 0.8s normal',
        'loading': 'loading 1s ease infinite'
      },
    },
  },
  plugins: [],
} satisfies Config;
