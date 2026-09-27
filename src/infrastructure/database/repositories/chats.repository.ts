import { Injectable, Provider } from "@nestjs/common";
import { ChatModel, CHATS_REPOSITORY_TOKEN, type IChatsRepository } from "../../../modules/chats/index.js";

@Injectable()
class ChatsRepository implements IChatsRepository {
    public async create(chat: ChatModel): Promise<ChatModel> {
        return chat;
    }

    public async getById(id: number): Promise<ChatModel | null> {
        return null;
    }

    public async getByName(name: string): Promise<ChatModel | null> {
        return null;
    }

    public async update(chat: ChatModel): Promise<void> {
        return;
    }

    public async delete(id: number): Promise<void> {
        return;
    }
}

export const CHATS_REPOSITORY_PROVIDER: Provider = {
    provide: CHATS_REPOSITORY_TOKEN,
    useClass: ChatsRepository
}