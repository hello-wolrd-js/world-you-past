/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";
import "./index.css";

const root = document.getElementById("root");

//开发环境下执行render
if (import.meta.env.DEV && root instanceof HTMLElement) {
    render(() => <App />, root!);
}

//默认导出
export default (el: HTMLElement) => {
    render(() => <App />, el);
};
