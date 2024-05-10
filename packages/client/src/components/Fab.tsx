import { Component, JSX, JSXElement, Show, createSignal } from "solid-js";
import { Opacity } from "./Opacity";

export const Fab: Component<{
    direction?: "right-bottom" | "right-top" | "left-top" | "left-bottom";
    menuDirection?: "right" | "left" | "top" | "bottom";
    position?: "absolute" | "fixed";
    width?: number; //单位是像素
    height?: number; //单位是像素
    trigger: JSXElement;
    menu: JSXElement;
}> = (props) => {
    //styles
    //#region

    const base: JSX.CSSProperties = {
        width: `${props.width || 40}px`,
        height: `${props.height || 40}px`,
        position: props.position || "fixed",
    };
    const fabPosition = (): JSX.CSSProperties => {
        if (props.direction) {
            return {
                top:
                    props.direction === "right-top" ||
                    props.direction === "left-top"
                        ? "20px"
                        : "",
                right:
                    props.direction === "right-top" ||
                    props.direction === "right-bottom"
                        ? "20px"
                        : "",
                bottom:
                    props.direction === "left-bottom" ||
                    props.direction === "right-bottom"
                        ? "20px"
                        : "",
                left:
                    props.direction === "left-bottom" ||
                    props.direction === "left-top"
                        ? "20px"
                        : "",
            };
        } else {
            return {
                right: "20px",
                bottom: "20px",
            };
        }
    };
    const menuVertical: JSX.CSSProperties = {
        width: "100%",
        left: "0",
        padding: "10px 0",
    };
    const menuLevel: JSX.CSSProperties = {
        height: "100%",
        top: "0",
        padding: "0 10px",
    };
    const menuDirection = (): JSX.CSSProperties => {
        switch (props.menuDirection) {
            case "top":
                return {
                    "flex-direction": "column-reverse",
                    bottom: "100%",
                    ...menuVertical,
                };
            case "right":
                return {
                    "flex-direction": "row",
                    left: "100%",
                    ...menuLevel,
                };
            case "bottom":
                return {
                    "flex-direction": "column",
                    top: "100%",
                    ...menuVertical,
                };
            case "left":
                return {
                    "flex-direction": "row-reverse",
                    right: "100%",
                    ...menuLevel,
                };
            default:
                return {
                    "flex-direction": "column-reverse",
                    bottom: "100%",
                    ...menuVertical,
                };
        }
    };

    //#endregion

    //透明度(可见状态切换)
    //#region
    const [show, setShow] = createSignal(false);
    const handleClick = () => {
        setShow((v) => !v);
    };
    //#endregion

    return (
        <div
            class="fixed rounded-md z-10 bg-pink-300 shadow-lg hover:bg-pink-200 duration-300"
            style={{
                ...fabPosition(),
                ...base,
            }}
        >
            <div class="relative rounded-md" style={{ ...base }}>
                {/* trigger */}
                <div
                    class="cursor-pointer"
                    onClick={handleClick}
                    style={{ ...base }}
                >
                    {props.trigger}
                </div>
                {/* menu */}
                <Opacity>
                    <Show when={show()}>
                        <div
                            class="absolute flex gap-2 duration-300"
                            style={{
                                ...menuDirection(),
                            }}
                        >
                            {props.menu}
                        </div>
                    </Show>
                </Opacity>
            </div>
        </div>
    );
};
