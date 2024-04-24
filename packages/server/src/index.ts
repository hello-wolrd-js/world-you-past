import { Elysia } from "elysia";

const port = 3000;
new Elysia().get("/", () => "hello!").listen(port);

console.log(`server is running on ${port}`);
