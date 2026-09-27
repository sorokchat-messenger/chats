import { ConfigService } from "@nestjs/config";
import { type AllConfigs } from "../config/index.js";
import { type TypeOrmModuleOptions } from "@nestjs/typeorm";

export function getTypeOrmConfig(
    configService: ConfigService<AllConfigs>,
): TypeOrmModuleOptions {
    return {
        type: "postgres",
        host: configService.getOrThrow("database.host", { infer: true }),
        port: configService.getOrThrow("database.port", { infer: true }),
        username: configService.getOrThrow("database.user", { infer: true }),
        password: configService.getOrThrow("database.password", { infer: true }),
        database: configService.getOrThrow("database.name", { infer: true }),
        synchronize: configService.getOrThrow("database.synchronize", {
            infer: true,
        }),
        ssl: configService.getOrThrow("database.ssl", { infer: true }),
        entities: [],
    };
}
