import Elysia from "elysia";
import "./db";
import { GameService } from "./service/game";
import { Logger } from "./plugin/log";
import { TLS } from "./plugin/tls";

new Elysia().use(TLS).use(Logger).use(GameService).listen(3555);
