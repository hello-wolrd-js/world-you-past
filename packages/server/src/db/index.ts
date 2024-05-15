import { connect } from "mongoose";
import record from "./record";

try {
    await connect("mongodb://localhost:27017/world-you-past");
    console.log("数据库连接成功");
} catch (error) {
    console.error("数据库连接失败");
}

export const db = {
    record,
};
