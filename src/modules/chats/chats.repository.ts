import { type ChatModel } from "./chat.model.js";

export interface IChatsRepository {
    create(chat: ChatModel): Promise<ChatModel>;
    getById(id: number): Promise<ChatModel | null>;
    getByName(name: string, limit: number, offset: number): Promise<ChatModel[]>;
    update(chat: ChatModel): Promise<ChatModel | null>;
    delete(id: number): Promise<void>;
}

export const CHATS_REPOSITORY_TOKEN = "CHATS_REPOSITORY";