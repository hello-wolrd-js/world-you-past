import Elysia from "elysia";
import { GameService } from "@/services/game";
import { RecordService } from "@/services/record";
import { UserService } from "@/services/user";
import { Logger } from "@/plugins/log";
import { TLS } from "@/plugins/tls";

new Elysia()
    .use(TLS)
    .use(Logger)
    .use(GameService)
    .use(RecordService)
    .use(UserService)
    .listen(3555);
