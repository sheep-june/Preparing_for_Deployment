export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            keyframes: {
                splitLeft: {
                    "0%": { transform: "translateX(0%)" },
                    "100%": { transform: "translateX(-100%)" },
                },
                splitRight: {
                    "0%": { transform: "translateX(0%)" },
                    "100%": { transform: "translateX(100%)" },
                },
            },
            animation: {
                "split-left": "splitLeft 0.8s ease-in-out forwards",
                "split-right": "splitRight 0.8s ease-in-out forwards",
            },
        },
    },
    plugins: [],
};
