import { User } from "./user";

export interface GameRecord {
    id: string;
    paths: Record<User["id"], Path[]>; //路径map: 用户id->对应用户在本次游戏中的路径
    totalTime: number; //本次游戏总耗时的时间戳
    startTime: string; //本次游戏开始的时间,格式形如: "2024/5/20 20:27"
    endTime: string; //本次游戏结束的时间,格式形如: "2024/5/20 20:27"
    support: number; //本次游戏的点赞数量
}

type Path = [number, number];
