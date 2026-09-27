import { type GrpcConnectionConfig, type BasicConfig } from "@sorokchat-messenger/config";
import { type DatabaseConfig } from "../schemas";

export type AllConfigs = {
    basic: BasicConfig;
    grpc: GrpcConnectionConfig;
    database: DatabaseConfig
}