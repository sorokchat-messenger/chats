import { getBasicEnv, getGrpcEnv } from "@sorokchat-messenger/config";
import "dotenv/config";

export function loadEnv() {
    return [getBasicEnv(process.env), getGrpcEnv(process.env)]
}