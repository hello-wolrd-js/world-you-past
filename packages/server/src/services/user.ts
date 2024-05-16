// import { db } from "@/db";
// import { userDTO } from "@/models/user";
// import {
//     createSuccessResponse as SR,
//     createErrorResponse as ER,
// } from "@world-you-past/shared/response";
// import Elysia from "elysia";

// export const UserService = new Elysia().group(
//     "/user",
//     (app) => app
//     //获取记录
//     // app.get(
//     //     "/record",
//     //     async ({ body }) => {
//     //         try {
//     //             return SR(200, "保存记录到用户成功", await db.record);
//     //         } catch (error) {
//     //             return ER(-1, error);
//     //         }
//     //     },
//     //     userDTO.record.create
//     // )
// );
