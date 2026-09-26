import { type ConfigModuleOptions } from "@nestjs/config";
import { loadEnv } from "../config/index.js";

export function getConfigOptions(): ConfigModuleOptions {
    return {
        isGlobal: true,
        load: loadEnv()
    }
}