import { createStore } from "solid-js/store";
import { GameRoom } from "@world-you-past/models";
import { nanoid } from "nanoid";
import { useUserStore } from "./user";
import { useWsStore } from "./ws";
import {
    createErrorResponse,
    isSuccessResponse,
} from "@world-you-past/shared/response";
import { GAME_API } from "@/api/game";

interface GameStoreState {
    currentGame: GameRoom | null; //当前游戏
    gameList: GameRoom[]; //所有的游戏列表
    playing: boolean; //游戏是否正在运行中
}

const [store, setStore] = createStore<GameStoreState>({
    currentGame: null,
    gameList: [],
    playing: false,
});

//创建一场游戏
const createGame = async (name: string) => {
    const userStore = useUserStore();
    const wsStore = useWsStore();

    try {
        const data = await wsStore.send("create-game", {
            roomName: name,
        });
        if (isSuccessResponse(data)) {
            const newGame: GameRoom = {
                id: nanoid(),
                name,
                players: [userStore.state.user!], //默认加上当前用户
            };
            setStore("currentGame", newGame);
        }
        return data;
    } catch (error) {
        return createErrorResponse(-3, "网络错误!");
    }
};

const getGameRooms = async () => {
    const result = await GAME_API.getGameRooms();
    if (isSuccessResponse(result)) {
        setStore("gameList", result.data);
    }
    return result;
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
        getGameRooms,
    };
};
