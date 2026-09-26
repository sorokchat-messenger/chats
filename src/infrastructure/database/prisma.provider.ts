import { Provider } from "@nestjs/common";
import { db } from "../../prisma/db.js";

export const DB = Symbol("PRISMA_DB");
export type Db = typeof db;

export const PRISMA_PROVIDER: Provider = {
    provide: DB,
    useValue: db
}