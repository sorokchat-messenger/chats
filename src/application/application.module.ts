import { Module } from "@nestjs/common";
import { USE_CASES } from "./use-cases/index.js";
import { DatabaseModule } from "../infrastructure/index.js";

@Module({
    imports: [DatabaseModule],
    providers: USE_CASES,
    exports: USE_CASES
})
export class ApplicationModule {
}