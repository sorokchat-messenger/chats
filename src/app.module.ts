import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CqrsModule, DatabaseModule, getConfigOptions } from "./infrastructure/index.js";
import { ChatModule } from "./presentation/index.js";

@Module({
    imports: [ConfigModule.forRoot(getConfigOptions()), CqrsModule, DatabaseModule, ChatModule]
})
export class AppModule { }