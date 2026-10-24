import { Id, type Chat } from "../model/index.js";

export interface IChatRepository {
    save(chat: Chat): Promise<void>;
    findById(id: Id): Promise<Chat | null>;
    delete(id: Id): Promise<void>;
}

export const CHAT_REPOSITORY_TOKEN: string = "CHAT_REPOSITORY";