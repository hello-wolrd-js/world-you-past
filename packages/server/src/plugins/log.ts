import Elysia from "elysia";

export const Logger = new Elysia().onBeforeHandle((r) => {
    console.log(r.request.method);
});
