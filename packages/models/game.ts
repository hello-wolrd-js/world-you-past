import { User } from "./user";

export interface GameRoom {
    id: string; //当前游戏的标识id
    name: string; //当前游戏(房间)的名字
    players: User[]; //当前游戏的玩家们
}

export interface GameRecord {
    id: string;
    paths: Record<User["id"], GamePath[]>; //路径map: 用户id->对应用户在本次游戏中的路径
    totalTime: number; //本次游戏总耗时的时间戳
    startTime: number; //本次游戏开始的时间戳
    endTime: number; //本次游戏结束的时间戳
    support: number; //本次游戏的点赞数量
}

export type GamePath = [number, number]; //第一个是经度,第二个是纬度
