import { useGameStore } from "@/stores/game";
import { Component, Show, createSignal } from "solid-js";
import toast from "solid-toast";

const gameStore = useGameStore();

const RoomItem: Component<{
    id: number; //序号
    name: string;
    count: number;
}> = (props) => {
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

const RoomAction: Component = () => {
    const [name, setName] = createSignal("");
    const handleCreateGame = () => {
        if (name()) gameStore.createGame(name());
        else toast.error("房间名不能为空");
    };
    return (
        <div class="mt-2 flex-1 flex justify-center items-center gap-1">
            <input
                type="text"
                placeholder="房间名"
                class="input input-sm input-bordered w-full max-w-xs"
                value={name()}
                onInput={(e) => setName(e.target.value)}
            />
            <button class="btn btn-warning btn-sm" onClick={handleCreateGame}>
                创建房间
            </button>
        </div>
    );
};

const CurrentRoom: Component = () => {
    const handleCloseRoom = () => {
        gameStore.overGame();
        toast.success("关闭成功");
    };
    return (
        <section class="flex-[0.7] flex gap-2 justify-center items-center rounded-lg">
            <div>房间名: {gameStore.state.currentGame?.name}</div>
            <div>人数: {gameStore.state.currentGame?.players.length}</div>
            <button class="btn btn-error btn-sm" onClick={handleCloseRoom}>
                关闭
            </button>
        </section>
    );
};

export const Room: Component = () => {
    return (
        <div class="w-full h-96 flex flex-col">
            {/* 房间列表 */}
            <RoomList></RoomList>
            {/* 房间操作 */}
            <Show when={gameStore.state.currentGame} fallback={<RoomAction />}>
                <CurrentRoom></CurrentRoom>
            </Show>
        </div>
    );
};
