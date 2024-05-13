import Elysia from "elysia";
import "./db";

new Elysia().get("/", () => "test").listen(6000);