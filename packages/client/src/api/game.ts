import { GameRoom } from "@world-you-past/models";
import { handleRequest } from "./handle";
import { GAME_API_INST } from "./instance";

export const getGameRooms = async () => {
    return await handleRequest<GameRoom[]>(() => GAME_API_INST.get("/room"));
};

export const GAME_API = {
    getGameRooms,
};
