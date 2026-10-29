import { Module } from "@nestjs/common";
import { ApplicationModule } from "../application/index.js";
import { CONTROLLERS } from "./controllers/index.js";
import { DatabaseModule } from "../infrastructure/index.js";
import { FILTER_PROVIDER } from "./filters/index.js";

@Module({
    imports: [ApplicationModule, DatabaseModule],
    controllers: CONTROLLERS,
    providers: [FILTER_PROVIDER]
})
export class ChatModule { }