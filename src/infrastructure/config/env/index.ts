import { getBasicEnv, getGrpcEnv } from "@sorokchat-messenger/config";
import "dotenv/config";
import { getDatabaseEnv } from "./database.env.js";

export function loadEnv() {
    return [getBasicEnv(process.env), getGrpcEnv(process.env), getDatabaseEnv(process.env)]
}