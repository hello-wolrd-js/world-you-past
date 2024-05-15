import { GameRecord } from "@world-you-past/models";
import { RECORD_API_INST } from "./instance";
import { handleRequest } from "./handle";

export const createGameRecord = async (
    record: Omit<GameRecord, "id" | "support">
) => {
    return await handleRequest<GameRecord>(() =>
        RECORD_API_INST.post("/", record)
    );
};

export const RECORD_API = {
    createGameRecord,
};
