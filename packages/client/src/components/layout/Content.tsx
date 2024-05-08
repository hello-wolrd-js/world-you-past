import { Component, JSXElement } from "solid-js";

export const Content: Component<{ navHeight: number; children: JSXElement }> = (
    props
) => {
    //因为拿不到clientHeight所以只能这样
    const bodyHeight = import.meta.env.DEV
        ? document.body.clientHeight
        : parseInt(document.body.style.height);
    const height = bodyHeight - props.navHeight;
    return (
        <main
            style={{
                "margin-top": props.navHeight + "px",
                height: height + "px",
            }}
        >
            {props.children}
        </main>
    );
};
