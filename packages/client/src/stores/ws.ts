import { createStore } from "solid-js/store";
import toast from "solid-toast";
import { useUserStore } from "./user";

interface WsStoreState {
    ws: WebSocket | null;
    wsTasks: Set<(data: unknown) => void>;
}

const [store, setStore] = createStore<WsStoreState>({
    ws: null,
    wsTasks: new Set(),
});

const initWS = () => {
    const userStore = useUserStore();
    if (userStore.state.user) {
        const _ws = new WebSocket(
            `wss://${import.meta.env.VITE_REMOTE}/game?playerId=${
                userStore.state.user.id
            }`
        );
        _ws.onopen = () => {
            console.log("websocket连接成功");
        };
        _ws.onerror = (e) => {
            toast.error("websocket连接失败!");
            console.error("连接服务器失败!", e);
        };
        _ws.onmessage = (e) => {
            store.wsTasks.forEach((t) => t(e.data));
        };
        setStore("ws", _ws);
    }
};

export const useWsStore = () => {
    return {
        initWS,
        state: store,
    };
};
