/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";
import "./index.css";
import { Route, Router } from "@solidjs/router";
import { HomeView } from "@/views/Home";
import { Toaster } from "solid-toast";

const root = document.getElementById("root");

const Main = () => (
    <>
        <Router root={App}>
            <Route path="/" component={HomeView} />
        </Router>
        <Toaster position="top-center" gutter={8} />
    </>
);

//开发环境下执行render
if (import.meta.env.DEV && root instanceof HTMLElement) {
    render(Main, root!);
}

//默认导出
export default (el: HTMLElement) => {
    render(Main, el);
};
