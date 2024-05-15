import mongoose from "mongoose";
import { GameRecord } from "@world-you-past/models";

//Schema
//#region
const GameRecordSchema = new mongoose.Schema<GameRecord>(
    {
        paths: {
            type: Map,
            of: [[Number]],
        },
        totalTime: {
            type: Number,
            required: true,
        },
        startTime: {
            type: Number,
            required: true,
        },
        endTime: {
            type: Number,
            required: true,
        },
        support: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        versionKey: false,
        //把_id转化为id
        toJSON: {
            transform(_, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
        //把_id转化为id
        toObject: {
            transform(_, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);
//#endregion

//Model
//#region
export const GameRecordModel = mongoose.model<GameRecord>(
    "game-record",
    GameRecordSchema
);
//#endregion

//创建游戏记录
export const createGameRecord = async (
    record: Omit<GameRecord, "id" | "support">
): Promise<GameRecord> => {
    try {
        const _record = await GameRecordModel.create(record);
        return _record.toJSON();
    } catch (error) {
        throw "创建游戏记录失败: " + error;
    }
};

export default {
    createGameRecord,
};
