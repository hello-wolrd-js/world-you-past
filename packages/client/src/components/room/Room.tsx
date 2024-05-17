import { useGameStore } from "@/stores/game";
import { isSuccessResponse } from "@world-you-past/shared/response";
import { Component, For, Show, createSignal } from "solid-js";
import toast from "solid-toast";

const gameStore = useGameStore();

//房间列表
//#region
const RoomItem: Component<{
    order: number; //序号
    name: string;
    count: number;
}> = (props) => {
    return (
        <div class="flex gap-2 justify-around text-center border-t-[1px] border-dashed py-3 pr-4">
            <span class="flex-1">{props.order}</span>
            <span class="flex-1">{props.name}</span>
            <span class="flex-1">{props.count}</span>
            <div class="btn btn-xs">加入</div>
        </div>
    );
};

const EmptyRoomListResult: Component = () => {
    return <h2 class="m-auto">当前无房间..</h2>;
};

const RoomList: Component = () => {
    const handleRefreshGameRooms = async () => {
        const result = await gameStore.getGameRooms();
        if (isSuccessResponse(result)) {
            toast.success("刷新成功");
        } else {
            toast.error("刷新失败: " + result.error);
            console.error(result.error);
        }
    };
    return (
        <>
            <div class="flex gap-2 justify-around text-center mb-2 pr-4">
                <span class="flex-1">序号</span>
                <span class="flex-1">名称</span>
                <span class="flex-1">人数</span>
                <div
                    class="btn btn-ghost btn-xs"
                    onClick={handleRefreshGameRooms}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                        />
                    </svg>
                </div>
            </div>

            <div class="flex flex-col max-h-[70%] min-h-[70%] overflow-y-auto">
                <Show
                    when={gameStore.state.gameList.length}
                    fallback={<EmptyRoomListResult />}
                >
                    <For each={gameStore.state.gameList}>
                        {(room, index) => (
                            <RoomItem
                                order={index()}
                                name={room.name}
                                count={1}
                            />
                        )}
                    </For>
                </Show>
            </div>
        </>
    );
};
//#endregion

//房间行为
//#region
const RoomAction: Component = () => {
    const [name, setName] = createSignal("");
    const handleCreateGame = async () => {
        if (!name()) return toast.error("房间名不能为空");

        const result = await gameStore.createGame(name());
        if (isSuccessResponse(result)) {
            toast.success("创建成功");
            gameStore.getGameRooms();
        } else {
            toast.error("创建失败: " + result.error);
            console.error(result.error);
        }
    };
    return (
        <div class="mt-2 flex-1 flex justify-center items-center gap-2">
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

//#endregion

const CurrentRoom: Component = () => {
    const handleCloseRoom = () => {
        gameStore.overGame();
        toast.success("关闭成功");
    };
    return (
        <section class="flex-1 flex gap-2 justify-center items-center rounded-lg">
            <div>房间名: {gameStore.state.currentGame?.name}</div>
            <div>人数: {gameStore.state.currentGame?.players.length}</div>
            <button class="btn btn-error btn-sm" onClick={handleCloseRoom}>
                关闭
            </button>
        </section>
    );
};

export const Room: Component = () => {
    gameStore.getGameRooms().then((result) => console.log(result));
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
