import { Injectable, type OnModuleDestroy, type OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from 'pg';
import { ConfigService } from "@nestjs/config";
import { type AllConfigs } from "../../config/index.js";
import { PrismaClient } from "../generated/prisma/client.js";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly pool: Pool;

    public constructor(configService: ConfigService<AllConfigs>) {
        const pool = new Pool({
            connectionString: configService.getOrThrow('database.url', { infer: true }),
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
            keepAlive: true
        });
        super({ adapter: new PrismaPg(pool) });
        this.pool = pool;
    }

    public async onModuleInit() {
        await this.$connect();
    }

    public async onModuleDestroy() {
        await this.$disconnect();
        await this.pool.end();
    }
}