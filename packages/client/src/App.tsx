import { type JSXElement, type Component } from "solid-js";
import { Content } from "@/components/layout/Content";
import { useNavigate } from "@solidjs/router";

const App: Component<{ children?: JSXElement }> = (props) => {
    //这里要navigate一下,触发根路由
    useNavigate()("");
    return (
        <div class="w-full h-full overflow-x-hidden">
            <Content>{props.children}</Content>
        </div>
    );
};
export default App;
