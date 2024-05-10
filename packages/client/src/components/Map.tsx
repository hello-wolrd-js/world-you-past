import AMapLoader from "@amap/amap-jsapi-loader";
import { toFixed, wgs84togcj02 } from "@world-you-past/shared/map";
import {
    Component,
    Show,
    createMemo,
    createSignal,
    onCleanup,
    onMount,
} from "solid-js";
import "@amap/amap-jsapi-types";
import { createStore, produce } from "solid-js/store";
import { Fab } from "./Fab";
import toast from "solid-toast";

//把安全密钥挂载在window对象上
(window as any)._AMapSecurityConfig = {
    securityJsCode: import.meta.env.VITE_AMAP_SECRET_KEY,
};
export const MapContainer: Component = () => {
    //用户头像
    //#region
    //监听地图缩放
    const [mapZoom, setMapZoom] = createSignal(20);
    const markZoom = () => (mapZoom() / 10) * 16 + "px";
    const markContent = (
        <img
            src="https://pub-a08fa93d49d347298f3cfbf1f32118b8.r2.dev/usagi.png"
            alt="usagi"
            class="shadow-xl rounded-md"
            style={{
                width: markZoom(),
                height: markZoom(),
            }} //跟随地图缩放自适应
        />
    );
    //#endregion

    //地图
    //#region
    let mapContainer: HTMLDivElement | undefined;
    let map: AMap.Map | null = null;
    let isInited: boolean = false;
    const initMap = async (pos: [number, number]) => {
        isInited = true;
        //初始化当前位置
        updateCenter(pos);
        //挂载地图
        try {
            //异步加载AMap
            await AMapLoader.load({
                key: import.meta.env.VITE_AMAP_KEY, //申请好的 Web 端开发者 Key，首次调用 load 时必填
                version: "2.0", //指定要加载的 JS API 的版本，缺省时默认为 1.4.15
                plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['AMap.Scale','...','...']
            });

            //初始化地图
            //#region
            map = new AMap.Map(mapContainer!, {
                viewMode: "2D",
                center: center.precise,
                zoom: mapZoom(),
            });

            //监听地图缩放,缩放时调整用户标识
            map.on("zoomend", () => {
                setMapZoom(map!.getZoom());
            });

            //用户轨迹线
            userPolyline = new AMap.Polyline({
                isOutline: true,
                outlineColor: "#ffeeff",
                borderWeight: 3,
                strokeColor: "#3366FF",
                strokeOpacity: 1,
                strokeWeight: 6,
                // 折线样式还支持 'dashed'
                strokeStyle: "dashed",
                // strokeStyle是dashed时有效
                strokeDasharray: [15, 5],
                lineJoin: "round",
                lineCap: "round",
                zIndex: 50,
            });
            map.add(userPolyline);
            //#endregion

            //用户标识
            //#region
            userMarker = new AMap.Marker({
                position: center.precise,
                content: markContent as HTMLElement,
            });
            userMarker.setMap(map);
            //#endregion
        } catch (error) {
            console.error("地图挂载失败: " + error);
        }
    };
    //#endregion

    //用户标记及其移动轨迹
    //#region
    let userMarker: AMap.Marker | null = null;
    let userPolyline: AMap.Polyline | null = null;
    //#endregion

    //实时经纬度以及状态显示
    //#region
    const [center, setCenter] = createStore<{
        precise: [number, number];
        rough: [number, number];
        last: [number, number];
    }>({
        precise: [0, 0],
        rough: [0, 0],
        last: [0, 0],
    });
    //判断是否移动
    const isMove = createMemo(() => {
        const offsetLng = Math.abs(center.rough[0] - center.last[0]);
        const offsetLat = Math.abs(center.rough[1] - center.last[1]);

        return offsetLng > 0.00005 || offsetLat > 0.00005;
    });
    //更新中心点位置
    const updateCenter = (pos: [number, number], last: boolean = true) => {
        setCenter(
            produce((state) => {
                state.precise = wgs84togcj02(...pos);
                state.rough = toFixed(state.precise, 5);
                if (last) state.last = [...state.rough];
            })
        );
    };
    const [status, setStatus] = createSignal("静止");
    const [count, setCount] = createSignal(0);
    //#endregion

    //实时定位
    //#region
    let positionWatcherId: number;
    onMount(() => {
        const path: [number, number][] = [];
        positionWatcherId = navigator.geolocation.watchPosition(
            async (pos) => {
                //初始化地图
                if (!isInited) {
                    console.log("initing map..");
                    return await initMap([
                        pos.coords.longitude,
                        pos.coords.latitude,
                    ]);
                }

                //守卫
                if (!map || !userMarker) return;

                //增加定位计数
                setCount((v) => v + 1);
                //更新中心点精确位置
                updateCenter(
                    [pos.coords.longitude, pos.coords.latitude],
                    false
                );

                //判断本次移动是否超过一定范围,超过再更新地图
                if (isMove()) {
                    //更新状态
                    setStatus("移动中");
                    //更新上一次的位置
                    setCenter("last", [...center.rough]);
                    //移动用户标记和地图中心点
                    map.setCenter(center.precise);
                    userMarker.setPosition(center.precise);
                    path.push(center.precise);
                    userPolyline?.setPath(path);
                } else {
                    setStatus("静止");
                }
            },
            (error) => {
                console.error("获取定位失败: " + error);
                toast.error("获取定位失败: " + error);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 1000,
                timeout: 1000,
            }
        );
    });
    onCleanup(() => {
        navigator.geolocation.clearWatch(positionWatcherId);
    });
    //#endregion

    //悬浮按钮
    //#region
    const trigger = (
        <img
            src="https://pub-a08fa93d49d347298f3cfbf1f32118b8.r2.dev/usagi.png"
            alt="usagi"
            class="w-full h-full shadow-xl rounded-md"
        />
    );
    const menu = (
        <div class="flex gap-2">
            {/* 房间大厅 */}
            <div class="btn shadow-xl">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                    />
                </svg>
            </div>
            {/* 将地图中心移动到用户位置 */}
            <div
                class="btn shadow-xl"
                onClick={() => map?.setCenter(center.precise)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                    />
                </svg>
            </div>
        </div>
    );
    //#endregion

    return (
        <div class="w-full h-full relative">
            {/* 仅限开发模式下的调试信息 */}
            <Show when={import.meta.env.DEV}>
                <div class="absolute top-0 left-0 right-0 z-10 flex flex-col items-center justify-center text-xl text-blue">
                    <div class="flex gap-5">
                        <span>lng: {center.rough[0]}</span>
                        <span>lat: {center.rough[1]}</span>
                    </div>
                    <div class="flex gap-2">
                        <span>last-lng: {center.last[0]}</span>
                        <span>last-lat: {center.last[1]}</span>
                    </div>
                    <span>
                        状态: {status()}, 定位计数: {count()}
                    </span>
                </div>
            </Show>
            {/* 地图容器 */}
            <div ref={mapContainer} class="w-full h-full"></div>
            {/* 悬浮按钮 */}
            <Fab
                trigger={trigger}
                menu={menu}
                menuDirection="left"
                width={50}
                height={50}
            />
        </div>
    );
};
