/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // CaribEX Design System Colors
        primary: {
          DEFAULT: '#0074F0',
          dark: '#0056B3',
          light: '#00C2FF',
        },
        secondary: '#00B878',
        accent: '#F5B700',
        background: '#F9FAFB',
        surface: '#FFFFFF',
        text: {
          primary: '#0E1116',
          secondary: '#4B5563',
        },
        border: '#E5E7EB',
        error: '#EF4444',
        warning: '#F59E0B',
        success: '#10B981',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(90deg, #0074F0 0%, #00C2FF 100%)',
      },
    },
  },
  plugins: [],
}
