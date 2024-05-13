import { createStore } from "solid-js/store";
import { Game } from "@world-you-past/models";
import { nanoid } from "nanoid";
import { useUserStore } from "./user";

interface GameStoreState {
    currentGame: Game | null;
    playing: boolean; //游戏是否正在运行中
}

const [store, setStore] = createStore<GameStoreState>({
    currentGame: null,
    playing: false,
});

//创建一场游戏
const createGame = (name: string) => {
    const userStore = useUserStore();
    const newGame: Game = {
        id: nanoid(),
        name,
        players: [userStore.state.user!], //默认加上当前用户
    };
    setStore("currentGame", newGame);
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
