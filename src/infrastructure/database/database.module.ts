import { Global, Module } from "@nestjs/common";
import { REPOSITORIES } from "./repositories/index.js";
import { PrismaModule } from "./prisma/index.js";
import { IdMapper, ChatMapper, ParticipantMapper } from "./mappers/index.js";

@Global()
@Module({
    providers: [...REPOSITORIES, IdMapper, ParticipantMapper, ChatMapper],
    exports: REPOSITORIES,
    imports: [PrismaModule]
})
export class DatabaseModule { }