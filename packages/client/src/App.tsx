import { type JSXElement, type Component } from "solid-js";
import { Nav } from "./components/layout/Nav";
import { Content } from "./components/layout/Content";
import { useNavigate } from "@solidjs/router";

const App: Component<{ children?: JSXElement }> = (props) => {
    const navHeight = 64;
    //这里要navigate一下,触发根路由
    useNavigate()("");
    return (
        <div class="w-full h-full overflow-x-hidden">
            <Nav />
            <Content navHeight={navHeight}>{props.children}</Content>
        </div>
    );
};
export default App;
