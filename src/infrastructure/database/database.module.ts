import { Global, Module } from "@nestjs/common";
import { REPOSITORIES } from "./repositories/index.js";

@Global()
@Module({
    providers: REPOSITORIES,
    exports: REPOSITORIES,
    imports: []
})
export class DatabaseModule { }