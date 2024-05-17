import { t } from "elysia";

export const gameDTO = {
    create: {
        body: t.Object({
            roomId: t.String(),
        }),
    },
};
