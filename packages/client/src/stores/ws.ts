import { createStore } from "solid-js/store";
import toast from "solid-toast";
import { useUserStore } from "./user";
import {
    ErrorResponse,
    MessageType,
    RequestMessageMap,
    Response,
    ResponseMessage,
    ResponseMessageMap,
    SuccessResponse,
} from "@world-you-past/models";
import { isSuccessResponse } from "@world-you-past/shared/response";

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
    <T extends MessageType>(
        data: SuccessResponse<ResponseMessageMap[T]> | ErrorResponse
    ) => void
>();

const initWS = () => {
    const userStore = useUserStore();
    if (userStore.state.user) {
        const _ws = new WebSocket(
            `wss://${import.meta.env.VITE_REMOTE}/game?player_name=${
                userStore.state.user.name
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
            //注意这里e.data是字符串,得parse一下
            const msg = JSON.parse(e.data) as Response<ResponseMessage, any>;
            if (isSuccessResponse(msg)) {
                const handler = _map.get(msg.data.type);
                handler?.(msg as any);
            }
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
