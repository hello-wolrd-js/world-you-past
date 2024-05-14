import Elysia from "elysia";
import "./db";
import { GameService } from "./service/game";
import { Logger } from "./plugin/log";
import { TLS } from "./plugin/tls";
import { saveService } from "./db/game";

new Elysia().use(TLS).use(Logger).use(GameService).use(saveService).listen(3555);
