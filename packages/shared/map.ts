/*
百度地图——百度坐标系——BD-09
高德地图、谷歌地图——火星坐标系——GCJ-02
天地图——国标2000坐标系（大地坐标系）——CGCS2000（WGS84）。(国标2000和WGS84坐标在经度上一样，在纬度上差别可以忽略不计，可以近似的看做一类。只要涉及到超高精度的地图计算，还是需要另外考虑)
*/

const x_PI = (Math.PI * 3000.0) / 180.0;
const a = 6378245.0;
const ee = 0.00669342162296594323;

//判断是否在国内，不在国内则不做偏移
const outOfChina = (lng: number, lat: number) => {
    return (
        lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271 || false
    );
};

//经度转换
function transformlat(lng: number, lat: number) {
    let ret =
        -100.0 +
        2.0 * lng +
        3.0 * lat +
        0.2 * lat * lat +
        0.1 * lng * lat +
        0.2 * Math.sqrt(Math.abs(lng));
    ret +=
        ((20.0 * Math.sin(6.0 * lng * Math.PI) +
            20.0 * Math.sin(2.0 * lng * Math.PI)) *
            2.0) /
        3.0;
    ret +=
        ((20.0 * Math.sin(lat * Math.PI) +
            40.0 * Math.sin((lat / 3.0) * Math.PI)) *
            2.0) /
        3.0;
    ret +=
        ((160.0 * Math.sin((lat / 12.0) * Math.PI) +
            320 * Math.sin((lat * Math.PI) / 30.0)) *
            2.0) /
        3.0;
    return ret;
}

//纬度转换
function transformlng(lng: number, lat: number) {
    let ret =
        300.0 +
        lng +
        2.0 * lat +
        0.1 * lng * lng +
        0.1 * lng * lat +
        0.1 * Math.sqrt(Math.abs(lng));
    ret +=
        ((20.0 * Math.sin(6.0 * lng * Math.PI) +
            20.0 * Math.sin(2.0 * lng * Math.PI)) *
            2.0) /
        3.0;
    ret +=
        ((20.0 * Math.sin(lng * Math.PI) +
            40.0 * Math.sin((lng / 3.0) * Math.PI)) *
            2.0) /
        3.0;
    ret +=
        ((150.0 * Math.sin((lng / 12.0) * Math.PI) +
            300.0 * Math.sin((lng / 30.0) * Math.PI)) *
            2.0) /
        3.0;
    return ret;
}

//精确小数点

export const toFixed = (
    target: [number, number],
    digit: number
): [number, number] => {
    const p1 = target[0].toFixed(digit);
    const p2 = target[1].toFixed(digit);
    return [parseFloat(p1), parseFloat(p2)];
};

// WGS84坐标系转火星坐标系GCj02 / 即WGS84 转谷歌、高德
export function wgs84togcj02(lng: number, lat: number): [number, number] {
    if (outOfChina(lng, lat)) {
        return [lng, lat];
    } else {
        let dlat = transformlat(lng - 105.0, lat - 35.0);
        let dlng = transformlng(lng - 105.0, lat - 35.0);
        const radlat = (lat / 180.0) * Math.PI;
        let magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        const sqrtmagic = Math.sqrt(magic);
        dlat =
            (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * Math.PI);
        dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * Math.PI);
        const mglat = lat + dlat;
        const mglng = lng + dlng;
        return [mglng, mglat];
    }
}

//火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换 / 即谷歌、高德 转 百度
export function gcj02tobd09(lng: number, lat: number): [number, number] {
    const z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
    const theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
    const bd_lng = z * Math.cos(theta) + 0.0065;
    const bd_lat = z * Math.sin(theta) + 0.006;
    return [bd_lng, bd_lat];
}

//GCJ02（火星坐标系） 转换为 WGS84 / 即谷歌高德转WGS84
export function gcj02towgs84(lng: number, lat: number): [number, number] {
    if (outOfChina(lng, lat)) {
        return [lng, lat];
    } else {
        let dlat = transformlat(lng - 105.0, lat - 35.0);
        let dlng = transformlng(lng - 105.0, lat - 35.0);
        const radlat = (lat / 180.0) * Math.PI;
        let magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        const sqrtmagic = Math.sqrt(magic);
        dlat =
            (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * Math.PI);
        dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * Math.PI);
        const mglat = lat + dlat;
        const mglng = lng + dlng;
        return [lng * 2 - mglng, lat * 2 - mglat];
    }
}

// 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换 / 即百度转谷歌、高德
export function bd09togcj02(bd_lon: number, bd_lat: number): [number, number] {
    const x = bd_lon - 0.0065;
    const y = bd_lat - 0.006;
    const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
    const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
    const gg_lng = z * Math.cos(theta);
    const gg_lat = z * Math.sin(theta);
    return [gg_lng, gg_lat];
}

//百度坐标系转wgs84坐标系
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function bd09towgs84(lng: number, lat: number): [number, number] {
    // 百度坐标系先转为火星坐标系
    const gcj02 = bd09togcj02(lng, lat);
    // 火星坐标系转wgs84坐标系
    const result = gcj02towgs84(gcj02[0], gcj02[1]);
    return result;
}

// wgs84坐标系转百度坐标系
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function wgs84tobd09(lng: number, lat: number): [number, number] {
    // wgs84先转为火星坐标系
    const gcj02 = wgs84togcj02(lng, lat);
    // 火星坐标系转百度坐标系
    const result = gcj02tobd09(gcj02[0], gcj02[1]);
    return result;
}
