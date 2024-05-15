import Elysia from "elysia";
import { GameService } from "@/services/game";
import { Logger } from "@/plugins/log";
import { TLS } from "@/plugins/tls";
import { RecordService } from "@/services/record";

new Elysia()
    .use(TLS)
    .use(Logger)
    .use(GameService)
    .use(RecordService)
    .listen(3555);
