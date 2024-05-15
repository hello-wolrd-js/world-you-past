import Elysia from "elysia";
import { recordDTO } from "@/models/record";
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
