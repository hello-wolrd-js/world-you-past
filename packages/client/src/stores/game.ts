import { createStore } from "solid-js/store";
import { Game } from "@world-you-past/models";
import { nanoid } from "nanoid";
import { useUserStore } from "./user";
import { useWsStore } from "./ws";
import {
    createErrorResponse,
    isSuccessResponse,
} from "@world-you-past/shared/response";

interface GameStoreState {
    currentGame: Game | null;
    playing: boolean; //游戏是否正在运行中
}

const [store, setStore] = createStore<GameStoreState>({
    currentGame: null,
    playing: false,
});

//创建一场游戏
const createGame = async (name: string) => {
    const userStore = useUserStore();
    const wsStore = useWsStore();
    if (!userStore.state.user || !wsStore.state.ws) return null;

    try {
        const data = await wsStore.send("create-game", {
            //用房间名作为roomId
            roomId: name,
        });
        if (isSuccessResponse(data)) {
            const newGame: Game = {
                id: nanoid(),
                name,
                players: [userStore.state.user], //默认加上当前用户
            };
            setStore("currentGame", newGame);
        }
        return data;
    } catch (error) {
        return createErrorResponse(-3, "网络错误!");
    }
};

//开始游戏
const startGame = () => {
    if (store.currentGame) setStore("playing", true);
};

//结束游戏
const overGame = () => {
    setStore("currentGame", null);
    setStore("playing", false);
};

export const useGameStore = () => {
    return {
        state: store,
        setStore,
        createGame,
        startGame,
        overGame,
    };
};
