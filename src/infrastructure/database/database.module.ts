import { Global, Module } from "@nestjs/common";
import { REPOSITORIES } from "./repositories/index.js";
import { PrismaModule } from "./prisma/index.js";

@Global()
@Module({
    providers: REPOSITORIES,
    exports: REPOSITORIES,
    imports: [PrismaModule]
})
export class DatabaseModule { }