/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Playfair Display', 'serif'],
            },
            colors: {
                bg: '#f7f3ed',
                'bg-warm': '#efe9df',
                surface: {
                    DEFAULT: '#ffffff',
                    warm: '#faf7f2',
                    muted: '#f0ebe3',
                },
                border: {
                    DEFAULT: '#e2dcd3',
                    light: '#ece7df',
                },
                text: {
                    DEFAULT: '#1a1a1a',
                    muted: '#6b6560',
                    light: '#9a948d',
                },
                accent: {
                    DEFAULT: '#2d4a3e',
                    hover: '#3a5f4f',
                    light: '#4a7a66',
                    dim: 'rgba(45, 74, 62, 0.08)',
                    muted: 'rgba(45, 74, 62, 0.15)',
                },
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
                'fade-in': 'fadeIn 0.6s ease-out forwards',
                'slide-down': 'slideDown 0.4s ease-out forwards',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
