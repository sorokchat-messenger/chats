import { Global, Module } from "@nestjs/common";
import { REPOSITORIES } from "./repositories/index.js";
import { PRISMA_PROVIDER } from "./prisma.provider.js";

@Global()
@Module({
    providers: [PRISMA_PROVIDER, ...REPOSITORIES],
    exports: REPOSITORIES
})
export class DatabaseModule { }