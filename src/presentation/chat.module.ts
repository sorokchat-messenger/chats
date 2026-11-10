import { Module } from "@nestjs/common";
import { CONTROLLERS } from "./controllers/index.js";
import { FILTER_PROVIDER } from "./filters/index.js";

@Module({
    imports: [],
    controllers: CONTROLLERS,
    providers: [FILTER_PROVIDER]
})
export class ChatModule { }