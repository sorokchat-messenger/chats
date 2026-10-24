import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { getConfigOptions } from "./infrastructure/index.js";
import { ChatModule } from "./presentation/index.js";

@Module({
    imports: [ConfigModule.forRoot(getConfigOptions()), ChatModule]
})
export class AppModule {
}