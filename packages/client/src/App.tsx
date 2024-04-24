import { createSignal, type Component } from "solid-js";

const App: Component = () => {
    const [count, setCount] = createSignal(0);
    const increment = () => {
        setCount(count() + 1);
    };
    const decrease = () => {
        setCount(count() - 1);
    };
    return (
        <div class="p-10">
            <div>count:{count()}</div>
            <button class="btn" onClick={increment}>
                +
            </button>
            <button class="btn ml-1" onClick={decrease}>
                -
            </button>
        </div>
    );
};

export default App;
