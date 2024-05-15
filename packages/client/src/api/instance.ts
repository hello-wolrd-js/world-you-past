import axios from "axios";
const createAPI = (url: string) => {
    const _instance = axios.create({
        baseURL: import.meta.env.VITE_API + url,
    });
    return _instance;
};

export const USER_API_INST = createAPI("/user");
export const RECORD_API_INST = createAPI("/record");
export const GAME_API_INST = createAPI("/game");
