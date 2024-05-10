import { Component, JSXElement } from "solid-js";
import { Transition } from "solid-transition-group";

export const Opacity: Component<{ children: JSXElement }> = (props) => {
    return Transition({
        onEnter(el, done) {
            const a = el.animate([{ opacity: 0 }, { opacity: 1 }], {
                duration: 300,
            });
            a.finished.then(done);
        },
        onExit(el, done) {
            const a = el.animate([{ opacity: 1 }, { opacity: 0 }], {
                duration: 300,
            });
            a.finished.then(done);
        },
        children: props.children,
    });
};
