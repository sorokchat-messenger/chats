import { Chat } from "../aggregate-roots/index.js";
import { type Id } from "../value-objects/index.js";

export interface IChatRepository {
    save(chat: Chat): Promise<void>;
    findById(id: Id): Promise<Chat | null>;
    findByName(name: string, actorId: Id, limit: number, offset: number): Promise<Chat[]>;
    findByUser(userId: Id, limit: number, offset: number): Promise<Chat[]>;
}

export const CHAT_REPOSITORY_TOKEN: string = "CHAT_REPOSITORY";