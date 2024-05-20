import { gameDTO } from "@/models/game";
import cors from "@elysiajs/cors";
import type {
    BroadcastRequestMessage,
    CreateGameRequestMessage,
    JoinGameRequestMessage,
    OverGameRequestMessage,
    RequestMessage,
} from "@world-you-past/models";
import {
    createSuccessResponse as SR,
    createErrorResponse as ER,
    createWebSocketErrorResponse as WER,
    createWebSocketSuccessResponse as WSR,
} from "@world-you-past/shared/response";
import Elysia from "elysia";
import { ElysiaWS } from "elysia/dist/ws";
import { nanoid } from "nanoid";

//游戏服务的实现
//#region
const PlayerMap = new Map<string, GamePlayer>();
const RoomMap = new Map<string, GameRoom>();

type WS = ElysiaWS<any, any, any>;
class GameRoom {
    private id: string = nanoid();
    private players: Set<GamePlayer> = new Set();
    constructor(public name: string) {}
    //房间内广播消息
    public broadcast<T>(msg: T) {
        this.players.forEach((player) => {
            player.ws.send(
                WSR(200, "广播消息", {
                    type: "broadcast",
                    data: msg,
                })
            );
        });
    }
    //关闭房间
    public close() {
        //从map中删除
        RoomMap.delete(this.name);
        //清除房间内的用户
        this.players.forEach((player) => player.ws.close());
        this.players.clear();
    }
    //加入房间
    public join(player: GamePlayer) {
        this.players.add(player);
    }
    //获取当前房间的信息
    public getInfo() {
        return {
            id: this.id,
            name: this.name,
            players: [...this.players.values()].map((p) => p.name),
        };
    }
}
class GamePlayer {
    private id: string = nanoid();
    constructor(public name: string, public ws: WS) {}
}
//#endregion

//游戏服务的接口
//#region

export const GameService = new Elysia()
    .use(cors())
    //联机服务
    .ws("/game", {
        open(ws) {
            const playerName = ws.data.query["player_name"];
            if (!playerName) {
                ws.send(ER(-1, "请传递player_name参数"));
                ws.close();
                return;
            }
            PlayerMap.set(playerName, new GamePlayer(playerName, ws));
        },
        message(ws, message) {
            //根据协议处理
            const msg = message as RequestMessage;
            if (msg.type === "create-game") {
                //创建游戏
                const data = msg.data as CreateGameRequestMessage;
                const roomName = data.roomName;
                if (!roomName) return ws.send(WER(-1, "需要roomName"));

                if (RoomMap.has(roomName))
                    return ws.send(WER(-1, "已存在相同房间"));

                RoomMap.set(roomName, new GameRoom(roomName));
                ws.send(
                    WSR(200, "创建房间成功!", {
                        type: "create-game",
                        data: { roomName },
                    })
                );
            } else if (msg.type === "join-game") {
                //加入游戏
                const { playerName, roomId } =
                    msg.data as JoinGameRequestMessage;
                const room = RoomMap.get(roomId);
                if (!room) return ws.send(WER(-1, "目标房间不存在"));

                const player = PlayerMap.get(playerName);
                if (!player) return ws.send(WER(-1, "目标用户不存在"));

                room.join(player);
                ws.send(
                    WSR(200, "加入房间成功", {
                        type: "join-game",
                        data: null,
                    })
                );
            } else if (msg.type === "broadcast") {
                //房间内广播
                const data = msg.data as BroadcastRequestMessage;
                const room = RoomMap.get(data.roomId);
                if (!room) return ws.send(WER(-1, "目标房间不存在"));
                room.broadcast(data.msg);
            } else if (msg.type === "over-game") {
                //结束游戏
                const data = msg.data as OverGameRequestMessage;
                const room = RoomMap.get(data.roomId);
                if (!room) return ws.send(WER(-1, "目标房间不存在"));
                room.close();
            } else {
                ws.send(WER(-1, "type错误"));
            }
        },
        error(ws) {
            console.log("websocket连接失败: " + ws);
        },
    })
    .group("/game/room", (app) =>
        //http形式的接口
        app
            .get("/", () => {
                return SR(
                    200,
                    "获取游戏房间列表成功",
                    [...RoomMap.values()].map((r) => r.getInfo())
                );
            })
            .post(
                "/",
                ({ body }) => {
                    const roomId = body.roomId;
                    if (RoomMap.has(roomId)) return ER(-1, "已存在相同房间");
                    RoomMap.set(roomId, new GameRoom(roomId));
                    return SR(200, "创建房间成功!", {
                        roomId,
                    });
                },
                gameDTO.create
            )
    );

//#endregion
