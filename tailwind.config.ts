import type { Config } from 'tailwindcss'
import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

const config: Config = {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode: "class", // Enable class-based dark mode
    theme: {
        extend: {
            keyframes: {
                logoLeftBracket: {
                    "0%": { opacity: 1 },
                    "100%": { left: "0", opacity: 1 },
                },
                logoRightBracket: {
                    "0%": { opacity: 1 },
                    "100%": { right: "0", opacity: 1 },
                },
                logoTextReveal: {
                    "0%": { "clip-path": "inset(0 50% 0 50%)", opacity: 0 },
                    "100%": { "clip-path": "inset(0 0 0 0)", opacity: 1 },
                },
            },
            animation: {
                logoLeftBracket: "logoLeftBracket 1s ease forwards",
                logoRightBracket: "logoRightBracket 1s ease forwards",
                logoTextReveal: "logoTextReveal 1s ease forwards",
            },
            colors: {
                primary: {
                    50: "#eff6ff",
                    100: "#dbeafe",
                    200: "#bfdbfe",
                    300: "#93c5fd",
                    400: "#60a5fa",
                    500: "#3b82f6",
                    600: "#2563eb",
                    700: "#1d4ed8",
                    800: "#1e40af",
                    900: "#1e3a8a",
                    950: "#172554",
                },
            },
            fontFamily: {
                poppins: ["Poppins", "sans-serif"],
                'fira-code': ["Fira Code", "monospace"],
                body: [
                    "Inter",
                    "ui-sans-serif",
                    "system-ui",
                    "-apple-system",
                    "system-ui",
                    "Segoe UI",
                    "Roboto",
                    "Helvetica Neue",
                    "Arial",
                    "Noto Sans",
                    "sans-serif",
                    "Apple Color Emoji",
                    "Segoe UI Emoji",
                    "Segoe UI Symbol",
                    "Noto Color Emoji",
                ],
                sans: [
                    "Figtree",
                    "Inter",
                    "ui-sans-serif",
                    "system-ui",
                    "-apple-system",
                    "system-ui",
                    "Segoe UI",
                    "Roboto",
                    "Helvetica Neue",
                    "Arial",
                    "Noto Sans",
                    "sans-serif",
                    "Apple Color Emoji",
                    "Segoe UI Emoji",
                    "Segoe UI Symbol",
                    "Noto Color Emoji",
                    ...defaultTheme.fontFamily.sans,
                ],
            },
        },
    },
    plugins: [forms, typography],
}
export default config