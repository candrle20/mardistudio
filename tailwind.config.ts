/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#1A4D4D",
          foreground: "#FAF9F6",
          50: "#F4E8E8",
          100: "#E8D1D1",
          500: "#D4A373",
          900: "#1A4D4D",
        },
        secondary: {
          DEFAULT: "#D4A373",
          foreground: "#1A4D4D",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FAF9F6",
        },
        muted: {
          DEFAULT: "#F5F4F0",
          foreground: "#2D2D2D",
        },
        accent: {
          DEFAULT: "#F4E8E8",
          foreground: "#1A4D4D",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

