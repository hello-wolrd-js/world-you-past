import mongoose from "mongoose";
import { GameRecord } from "@world-you-past/models";
import { UserModel } from "./user";
import { GameRecordSchema } from "./schema";

export const GameRecordModel = mongoose.model<GameRecord>(
    "record",
    GameRecordSchema
);

//创建游戏记录
export const createGameRecord = async (
    record: Omit<GameRecord, "id" | "support">
): Promise<GameRecord> => {
    try {
        const recordDoc = await GameRecordModel.create(record);
        const recordJSON = recordDoc.toJSON();

        for (const playerId of Object.keys(recordJSON.paths)) {
            try {
                let user = await UserModel.findById(playerId);
                //有用户就保存,没用户就创建一个新用户然后加上记录
                if (!user) user = new UserModel();
                user.records.push(recordDoc.id);
                await user.save();
            } catch (error) {
                throw "保存用户记录失败: " + error;
            }
        }
        return recordJSON;
    } catch (error) {
        throw "创建游戏记录失败: " + error;
    }
};

export default {
    createGameRecord,
};
