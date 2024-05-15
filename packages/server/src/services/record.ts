import Elysia from "elysia";
import { recordDTO, user_recordDTO } from "@/models/record";
import {
    createSuccessResponse as SR,
    createErrorResponse as ER,
} from "@world-you-past/shared/response";
import { db } from "@/db";

export const RecordService = new Elysia().group("/record", (app) =>
    app.post(
        "/",
        async ({ body }) => {
            try {
                return SR(
                    200,
                    "创建记录成功",
                    await db.record.createGameRecord(body)
                );
            } catch (error) {
                return ER(-1, error);
            }
        },
        recordDTO.save
    )
);

export const SaveUserRecordService = new Elysia().group("/save_user_record", (app) =>
    app.post(
        "/",
        async ({ body }) => {
            try {
                return SR(
                    200,
                    "保存记录到用户成功",
                    await db.record.saveUserRecord(body)
                );
            } catch (error) {
                return ER(-1, error);
            }
        },
        user_recordDTO.save
    )
);
