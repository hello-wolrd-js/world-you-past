import { resolve } from "path";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { fileURLToPath } from "node:url";

const cert = process.env["SSL_CERT"];
const key = process.env["SSL_KEY"];
export default defineConfig({
    plugins: [solidPlugin(), cssInjectedByJsPlugin()],
    server: {
        port: 5000,
        https:
            cert && key
                ? {
                      // 这里要根据开发环境换成不同的路径!
                      cert,
                      key,
                  }
                : void 0,
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
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
});
