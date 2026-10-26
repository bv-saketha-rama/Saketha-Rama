/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                display: ['Manrope', 'system-ui', 'sans-serif'],
                sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'ui-monospace', 'Menlo', 'Consolas', 'monospace'],
                serif: ['"Instrument Serif"', 'Georgia', 'serif'],
            },
            colors: {
                bg: 'var(--bg)',
                surface: 'var(--surface)',
                ink: 'var(--text)',
                muted: 'var(--text-2)',
                line: 'var(--border)',
                accent: 'var(--accent)',
                yc: 'var(--yc)',
            },
            maxWidth: {
                page: '1160px',
            },
        },
    },
    plugins: [],
}
