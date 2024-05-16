import { Schema, Types } from "mongoose";

export const GameRecordSchema = new Schema(
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

export const UserSchema = new Schema(
    {
        records: [{ type: Types.ObjectId, ref: "record" }], // 用户所参与比赛的游戏
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
