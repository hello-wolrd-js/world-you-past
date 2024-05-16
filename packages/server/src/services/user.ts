import { db } from "@/db";
import { userDTO } from "@/models/user";
import {
    createSuccessResponse as SR,
    createErrorResponse as ER,
} from "@world-you-past/shared/response";
import Elysia from "elysia";

export const UserService = new Elysia().group("/user", (app) =>
    app.get(
        // 获取记录
        "/record",
        async () => {
            try {
                return SR(200, "获取用户记录成功", "test");
            } catch (error) {
                return ER(-1, error);
            }
        },
        userDTO.record.create
    )
);
