import { type ChatModel } from "./chat.model.js";

export interface IChatsRepository {
    create(chat: ChatModel): Promise<ChatModel>;
    getById(id: string): Promise<ChatModel | null>;
    getByName(name: string, limit: number, offset: number): Promise<ChatModel[]>;
    update(chat: ChatModel): Promise<ChatModel | null>;
    delete(id: string): Promise<void>;
}

export const CHATS_REPOSITORY_TOKEN = "CHATS_REPOSITORY";