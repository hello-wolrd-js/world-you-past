export type MessageType =
    | "create-game"
    | "join-game"
    | "over-game"
    | "broadcast";

//websocket通信请求格式
//请求
export interface RequestMessage<
    T extends
        | BroadcastRequestMessage
        | CreateGameRequestMessage
        | unknown = unknown
> {
    //根据不同的类型做出不同的响应
    type: MessageType;
    data: T;
}

//请求信息格式
export interface JoinGameRequestMessage {
    playerId: string; //玩家id
    roomId: string; //游戏id
}

export interface BroadcastRequestMessage {
    roomId: string; //房间id
    msg: string; //广播的信息
}

export interface CreateGameRequestMessage {
    roomId: string; //房间id
}

export interface OverGameRequestMessage {
    roomId: string; //要结束房间id
}

export type RequestMessageMap = {
    "create-game": CreateGameRequestMessage;
    "join-game": JoinGameRequestMessage;
    "over-game": OverGameRequestMessage;
    broadcast: BroadcastRequestMessage;
};

//响应
//#region
export type ResponseMessageMap = {
    "create-game": RequestMessage<CreateGameResponseMessage>;
    "join-game": JoinGameRequestMessage;
    "over-game": OverGameRequestMessage;
    broadcast: BroadcastRequestMessage;
};

//websocket响应格式
export interface ResponseMessage<
    T extends CreateGameResponseMessage | unknown = unknown
> {
    //根据不同的类型做出不同的响应
    type: MessageType;
    data: T;
}

export interface CreateGameResponseMessage {}

//#endregion
