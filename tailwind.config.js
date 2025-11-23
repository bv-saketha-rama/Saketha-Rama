/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                mono: ['"Courier Prime"', 'monospace'],
                racing: ['"Orbitron"', 'sans-serif'],
            },
            colors: {
                'racing-asphalt': '#0a0a0a', // Darker for better contrast
                'racing-cyan': '#00ffff', // Brighter cyan
                'racing-red': '#ff003c',
            },
            animation: {
                'blink': 'blink 1s step-end infinite',
                'grid-flow': 'grid-flow 2s linear infinite',
            },
            keyframes: {
                blink: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0' },
                },
                'grid-flow': {
                    '0%': { transform: 'translateY(0)' },
                    '100%': { transform: 'translateY(40px)' },
                }
            },
        },
    },
    plugins: [],
}
