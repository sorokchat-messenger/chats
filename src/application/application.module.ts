import { Module } from "@nestjs/common";
import { USE_CASES } from "./use-cases/index.js";

@Module({
    imports: [],
    providers: USE_CASES,
    exports: USE_CASES
})
export class ApplicationModule {
}