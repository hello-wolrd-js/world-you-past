import { resolve } from "path";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
    plugins: [solidPlugin(), cssInjectedByJsPlugin()],
    server: {
        port: 3000,
    },
    build: {
        //库模式构建选项
        lib: {
            entry: resolve(__dirname, "./src/index.tsx"),
            name: "your-world",
            fileName: "your-world",
            formats: ["es"],
        },
    },
});
