import AMapLoader from "@amap/amap-jsapi-loader";
import { wgs84togcj02 } from "@world-you-past/shared/map";
import { Component, createSignal, onCleanup, onMount } from "solid-js";
import "@amap/amap-jsapi-types";

export const MapContainer: Component = () => {
    //把安全密钥挂载在window对象上
    (window as any)._AMapSecurityConfig = {
        securityJsCode: import.meta.env.VITE_AMAP_SECRET_KEY,
    };

    let mapContainer: HTMLDivElement | undefined;
    let map: AMap.Map | null = null;

    let userMarker: AMap.Marker | null = null;
    let userPolyline: AMap.Polyline | null = null;

    let watchPosId: number;
    onMount(() => {
        //当前位置初始化
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                //处理坐标
                const center: [number, number] = wgs84togcj02(
                    pos.coords.longitude,
                    pos.coords.latitude
                );

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

                    //用户标识
                    const [mapZoom, setMapZoom] = createSignal(20);

                    map = new AMap.Map(mapContainer!, {
                        viewMode: "2D",
                        center,
                        zoom: mapZoom(),
                    });

                    //缩放时调整用户标识
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
                    const markZoom = () => (mapZoom() / 10) * 16 + "px";
                    const markContent = (
                        <img
                            src="https://pub-a08fa93d49d347298f3cfbf1f32118b8.r2.dev/usagi.png"
                            alt="usagi"
                            class="shadow-xl rounded-md"
                            style={{ width: markZoom(), height: markZoom() }} //跟随地图缩放自适应
                        />
                    );
                    userMarker = new AMap.Marker({
                        position: center,
                        content: markContent as HTMLElement,
                    });
                    userMarker.setMap(map);
                } catch (error) {
                    console.error("地图挂载失败: " + error);
                }
            },
            (error) => {
                console.error("获取定位失败: " + error);
            }
        );

        const path: [number, number][] = [];
        let lastCenter: [number, number] = [0, 0];
        watchPosId = navigator.geolocation.watchPosition(
            async (pos) => {
                const center: [number, number] = wgs84togcj02(
                    pos.coords.longitude,
                    pos.coords.latitude
                );
                lastCenter = center;
                //移动用户标记和地图中心点
                map?.setCenter(center);
                userMarker?.setPosition(center);

                //同步轨迹: 只有变化的时候才设置
                if (
                    lastCenter[0] !== center[0] &&
                    lastCenter[1] !== center[1]
                ) {
                    path.push(center);
                    userPolyline?.setPath(path);
                }
            },
            (error) => {
                console.error("获取定位失败: " + error);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 2000,
            }
        );
    });
    onCleanup(() => {
        navigator.geolocation.clearWatch(watchPosId);
    });

    return <div ref={mapContainer} class="w-full h-full"></div>;
};
