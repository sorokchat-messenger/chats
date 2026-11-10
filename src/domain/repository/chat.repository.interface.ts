import { Chat } from "../aggregate-roots/index.js";
import { type Id } from "../value-objects/index.js";
import { ChatRole } from '@sorokchat-messenger/microservices';

export type ChatDetails = {
    id: string;
    name: string;
    description: string;
    participants: {
        userId: string;
        login: string;
        displayName: string;
        role: ChatRole
    }[]
}

export interface IChatRepository {
    save(chat: Chat): Promise<void>;
    findById(id: Id): Promise<Chat | null>;
    findByName(name: string, actorId: Id, limit: number, offset: number): Promise<ChatDetails[]>;
    findByUser(userId: Id, limit: number, offset: number): Promise<ChatDetails[]>;
}

export const CHAT_REPOSITORY_TOKEN: string = "CHAT_REPOSITORY";