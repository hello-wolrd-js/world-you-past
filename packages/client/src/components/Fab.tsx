import { Component, JSX, JSXElement, Show, createSignal } from "solid-js";
import { Transition } from "solid-transition-group";

export const Fab: Component<{
    direction?: "right-bottom" | "right-top" | "left-top" | "left-bottom";
    menuDirection?: "right" | "left" | "top" | "bottom";
    trigger: JSXElement;
    menu: JSXElement;
}> = (props) => {
    //styles
    //#region

    const base: JSX.CSSProperties = {
        width: "40px",
        height: "40px",
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
            class="absolute rounded-md z-10 bg-pink-300 shadow-lg hover:bg-pink-200 duration-300"
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
                <Transition
                    onEnter={(el, done) => {
                        const a = el.animate([{ opacity: 0 }, { opacity: 1 }], {
                            duration: 300,
                        });
                        a.finished.then(done);
                    }}
                    onExit={(el, done) => {
                        const a = el.animate([{ opacity: 1 }, { opacity: 0 }], {
                            duration: 300,
                        });
                        a.finished.then(done);
                    }}
                >
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
                </Transition>
            </div>
        </div>
    );
};
