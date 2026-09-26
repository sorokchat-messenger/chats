import { type ChatModel } from "./chat.model.js";

export interface IChatsRepository {
    create(chat: ChatModel): Promise<ChatModel>;
    getById(id: number): Promise<ChatModel | null>;
    getByName(name: string): Promise<ChatModel | null>;
    update(chat: ChatModel): Promise<void>;
    delete(id: number): Promise<void>;
}

export const CHATS_REPOSITORY_TOKEN = "CHATS_REPOSITORY";