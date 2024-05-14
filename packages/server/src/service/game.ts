import type {
    BroadcastRequestMessage,
    JoinGameRequestMessage,
    OverGameRequestMessage,
    RequestMessage,
} from "@world-you-past/models";
import {
    createSuccessResponse as SR,
    createErrorResponse as ER,
} from "@world-you-past/shared/response";
import Elysia from "elysia";
import { ElysiaWS } from "elysia/dist/ws";
import { nanoid } from "nanoid";

const PlayerMap = new Map<string, GamePlayer>();
const RoomMap = new Map<string, GameRoom>();

type WS = ElysiaWS<any, any, any>;
class GameRoom {
    private players: Set<GamePlayer> = new Set();
    constructor(private id: string) {}
    //房间内广播消息
    public broadcast<T>(msg: T) {
        this.players.forEach((player) => {
            player.ws.send(msg);
        });
    }
    //关闭房间
    public close() {
        //从map中删除
        RoomMap.delete(this.id);
        //清除房间内的用户
        this.players.forEach((player) => player.ws.close());
        this.players.clear();
    }
    //加入房间
    public join(player: GamePlayer) {
        this.players.add(player);
    }
}

class GamePlayer {
    constructor(public id: string, public ws: WS) {}
}

export const GameService = new Elysia().ws("/game", {
    open(ws) {
        const playerId = ws.data.query["playerId"];
        if (!playerId) {
            ws.send(ER(-1, "请传递playerId参数"));
            ws.close();
            return;
        }
        PlayerMap.set(playerId, new GamePlayer(playerId, ws));
    },
    message(ws, message) {
        //根据协议处理
        const msg = message as RequestMessage;
        if (msg.type === "create-game") {
            //创建游戏
            const roomId = nanoid();
            if (RoomMap.has(roomId)) return ws.send(ER(-1, "已存在相同房间"));

            RoomMap.set(roomId, new GameRoom(roomId));
            ws.send(
                SR(200, "创建房间成功!", {
                    roomId,
                })
            );
        } else if (msg.type === "join-game") {
            //加入游戏
            const { playerId, roomId } = msg.data as JoinGameRequestMessage;
            const room = RoomMap.get(roomId);
            if (!room) return ws.send(ER(-1, "目标房间不存在"));

            const player = PlayerMap.get(playerId);
            if (!player) return ws.send(ER(-1, "目标用户不存在"));

            room.join(player);
            ws.send(SR(200, "加入房间成功", null));
        } else if (msg.type === "broadcast") {
            //房间内广播
            const data = msg.data as BroadcastRequestMessage;
            const room = RoomMap.get(data.roomId);
            if (!room) return ws.send(ER(-1, "目标房间不存在"));
            room.broadcast(data.msg);
        } else if (msg.type === "over-game") {
            //结束游戏
            const data = msg.data as OverGameRequestMessage;
            const room = RoomMap.get(data.roomId);
            if (!room) return ws.send(ER(-1, "目标房间不存在"));
            room.close();
        } else {
            ws.send(ER(-1, "type错误"));
        }
    },
});