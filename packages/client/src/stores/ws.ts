import { createStore } from "solid-js/store";
import toast from "solid-toast";
import { useUserStore } from "./user";
import {
    ErrorResponse,
    MessageType,
    RequestMessageMap,
    ResponseMessageMap,
    SuccessResponse,
} from "@world-you-past/models";

interface WsStoreState {
    ws: WebSocket | null;
    wsTasks: Set<<T extends MessageType>(data: ResponseMessageMap[T]) => void>;
}

const [store, setStore] = createStore<WsStoreState>({
    ws: null,
    wsTasks: new Set(),
});

const _map = new Map<
    MessageType,
    <T extends MessageType>(data: ResponseMessageMap[T]) => void
>();

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
            const data = e.data;
            _map.get(data.type)?.(data);
        };
        setStore("ws", _ws);
    }
};

//封装格式的send方法
async function send<T extends MessageType>(
    type: T,
    data: RequestMessageMap[T]
): Promise<SuccessResponse<ResponseMessageMap[T]> | ErrorResponse> {
    return new Promise((resolve) => {
        _map.set(type, (data) => {
            resolve(data as any);
            _map.delete(type);
        });
        store.ws?.send(
            JSON.stringify({
                type,
                data,
            })
        );
    });
}

export const useWsStore = () => {
    return {
        initWS,
        state: store,
        send,
    };
};
