import { User } from "@world-you-past/models";
import { createStore } from "solid-js/store";
import toast from "solid-toast";

interface UserStoreState {
    user: User | null;
    ws: WebSocket | null;
}

const [store, setStore] = createStore<UserStoreState>({
    user: null,
    ws: null,
});

const initWS = () => {
    if (store.user) {
        const _ws = new WebSocket(
            `wss://${import.meta.env.VITE_REMOTE}/game?playerId=${
                store.user.id
            }`
        );
        _ws.onopen = () => {
            console.log("连接成功");
        };
        _ws.onerror = (e) => {
            toast.error("连接服务器失败!");
            console.error("连接服务器失败!", e);
        };
        setStore("ws", _ws);
    }
};

export const useUserStore = () => {
    return {
        state: store,
        setStore,
        initWs: initWS,
    };
};
