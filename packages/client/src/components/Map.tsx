import AMapLoader from "@amap/amap-jsapi-loader";
import { wgs84togcj02 } from "@world-you-past/shared/map";
import { Component, onMount } from "solid-js";
import "@amap/amap-jsapi-types";

export const MapContainer: Component = () => {
    (window as any)._AMapSecurityConfig = {
        securityJsCode: import.meta.env.VITE_AMAP_SECRET_KEY,
    };

    onMount(() => {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const center: [number, number] = wgs84togcj02(
                    pos.coords.longitude,
                    pos.coords.latitude
                );
                console.log(center);
            },
            (err) => {
                console.log(err);
            }
        );

        AMapLoader.load({
            key: import.meta.env.VITE_AMAP_KEY, //申请好的 Web 端开发者 Key，首次调用 load 时必填
            version: "2.0", //指定要加载的 JS API 的版本，缺省时默认为 1.4.15
            plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['AMap.Scale','...','...']
        })
            .then(() => {
                //注意这里拿到的AMap是脚本加载后的全局变量
                const map = new AMap.Map("map-container"); //"container"为 <div> 容器的 id
            })
            .catch((e) => {
                console.log(e);
            });
    });

    return <div id="map-container" class="w-full h-full"></div>;
};
