import { Component } from "solid-js";

const RoomItem: Component<{ id: number; name: string; count: number }> = (
    props
) => {
    return (
        <div class="flex gap-2 justify-around text-center border-t-[1px] border-dashed py-3 pr-4">
            <span class="flex-1">{props.id}</span>
            <span class="flex-1">{props.name}</span>
            <span class="flex-1">{props.count}</span>
            <div class="btn btn-xs">加入</div>
        </div>
    );
};

const RoomList: Component = () => {
    return (
        <>
            <div class="flex gap-2 justify-around text-center mb-2 pr-4">
                <span class="flex-1">序号</span>
                <span class="flex-1">名称</span>
                <span class="flex-1">人数</span>
                <div class="btn btn-xs opacity-0">加入</div>
            </div>
            <div class="flex flex-col max-h-[60%] overflow-y-auto">
                <RoomItem id={1} name="kancy" count={1}></RoomItem>
                <RoomItem id={2} name="kancy" count={2}></RoomItem>
                <RoomItem id={3} name="kancy" count={3}></RoomItem>
                <RoomItem id={3} name="kancy" count={3}></RoomItem>
                <RoomItem id={3} name="kancy" count={3}></RoomItem>
                <RoomItem id={3} name="kancy" count={3}></RoomItem>
            </div>
        </>
    );
};

export const RoomAction: Component = () => {
    return <div></div>;
};

export const Room: Component = () => {
    return (
        <div class="w-full h-96 flex flex-col">
            <h1 class="text-xl text-center">房间大厅</h1>
            <div class="divider"></div>
            {/* 房间列表 */}
            <RoomList></RoomList>
            {/* 房间操作 */}
            <RoomAction></RoomAction>
        </div>
    );
};
