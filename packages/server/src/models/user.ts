import { t } from "elysia";
import { createErrorProvider as E } from "@/utils/dto";

export const userDTO = {
    record: {
        create: {
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
    },
};
