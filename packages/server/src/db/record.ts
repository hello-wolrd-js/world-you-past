import mongoose from "mongoose";
import { GameRecord, User } from "@world-you-past/models";

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
const userSchema = new mongoose.Schema({
    id: { type: String, required: true },
    avatar: { type: String, required: true }, //用户头像
    records: [GameRecordSchema], // 用户所参与比赛的游戏
});
//#endregion

//Model
//#region
export const GameRecordModel = mongoose.model<GameRecord>(
    "game-record",
    GameRecordSchema
);

export const UserModel = mongoose.model<User>(
    'User',
    userSchema
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
//保存游戏记录到用户
export const saveUserRecord = async (
    record: GameRecord
): Promise<GameRecord> => {
    try {
    
        const playerIds = Object.keys(record.paths);

        for (const playerId of playerIds) {
            // 获取每一个玩家
            const user = await UserModel.findById(playerId);
            // 添加新游戏记录到玩家记录列表中
            if (user) { 
                user.records.push(record);
                await user.save();
            }
        }
        
        return record;
    } catch (error) {
        throw new Error("保存游戏记录失败: " + error);
    }
};

export default {
    createGameRecord,
    saveUserRecord
};

