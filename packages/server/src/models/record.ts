import { createErrorProvider as E } from "@/utils/dto";
import { t } from "elysia";

export const recordDTO = {
    save: {
        body: t.Object(
            {
                paths: t.Record(
                    t.String(),
                    t.Array(t.Tuple([t.Number(), t.Number()])),
                    E("需要paths")
                ),
                totalTime: t.Number(E("需要totalTime")),
                startTime: t.Number(E("需要startTime")),
                endTime: t.Number(E("需要endTime")),
            },
            E("需要请求体")
        ),
    },
};

export const user_recordDTO = {
    save: {
        body: t.Object(
            {   id:t.String(E("需要gameid")),
                paths: t.Record(
                    t.String(),
                    t.Array(t.Tuple([t.Number(), t.Number()])),
                    E("需要paths")
                ),
                totalTime: t.Number(E("需要totalTime")),
                startTime: t.Number(E("需要startTime")),
                endTime: t.Number(E("需要endTime")),
                support:t.Number(E("需要support")),
            },
            E("需要请求体")
        ),
    },
};