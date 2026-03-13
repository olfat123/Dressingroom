import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.{jsx,js}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: { "2xl": "1400px" },
        },
        extend: {
            fontFamily: {
                display: ["Cormorant Garamond", "serif"],
                body: ["Outfit", "sans-serif"],
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                gold: "hsl(var(--gold))",
                "gold-light": "hsl(var(--gold-light))",
                cream: "hsl(var(--cream))",
                "cream-dark": "hsl(var(--cream-dark))",
                charcoal: "hsl(var(--charcoal))",
                "charcoal-light": "hsl(var(--charcoal-light))",
                "warm-gray": "hsl(var(--warm-gray))",
                blush: "hsl(var(--blush))",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "fade-in": {
                    from: { opacity: "0", transform: "translateY(20px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                "slide-in": {
                    from: { opacity: "0", transform: "translateX(-20px)" },
                    to: { opacity: "1", transform: "translateX(0)" },
                },
                "scale-in": {
                    from: { opacity: "0", transform: "scale(0.95)" },
                    to: { opacity: "1", transform: "scale(1)" },
                },
            },
            animation: {
                "fade-in": "fade-in 0.6s ease-out forwards",
                "slide-in": "slide-in 0.6s ease-out forwards",
                "scale-in": "scale-in 0.2s ease-out forwards",
            },
        },
    },
    plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

