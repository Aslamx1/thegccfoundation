import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gfm: {
          green: '#02A95C', // Exact GoFundMe Emerald Green
          hover: '#028F4D', // GoFundMe Darker Green Hover
          forest: '#012D19', // GoFundMe Dark Forest Green for Guarantee Banner
          cream: '#FBF9F6', // GoFundMe Warm Cream/Sand Background
          charcoal: '#1A1A1A', // GoFundMe Deep Charcoal text
          slate: '#6B7280', // GoFundMe Secondary Slate text
          yellow: '#FBBF24', // GoFundMe Warm Gold/Yellow Share button
          yellowHover: '#F59E0B',
          border: '#E5E7EB',
        },
        gcc: {
          50: '#F4F7EE',
          100: '#E6EED8',
          200: '#CDDCB3',
          300: '#AFC68A',
          400: '#8AA95E',
          500: '#688B39',
          600: '#4D6B24',
          700: '#3D5E16', // GCC Foundation Forest Green
          800: '#2F4812',
          900: '#1F310C',
        },
        ochre: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#E28723',
          600: '#D97706',
          700: '#B45309',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Plus Jakarta Sans', 'DM Sans', 'sans-serif'],
        body: ['var(--font-body)', 'DM Sans', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
        'card': '0 1px 4px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'elevated': '0 8px 24px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'gfm': '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
