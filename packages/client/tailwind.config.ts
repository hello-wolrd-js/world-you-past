import daisyUI from "daisyui";
import type { Config } from "tailwindcss/types/config";
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [daisyUI],
    daisyui: {
        themes: ["light", "dark", "wireframe"],
    },
} as Config;
