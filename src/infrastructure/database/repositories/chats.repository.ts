import { Inject, Injectable, Provider } from "@nestjs/common";
import { ChatModel, CHATS_REPOSITORY_TOKEN, type IChatsRepository } from "../../../modules/chats/index.js";
import { type Db, DB } from "../prisma.provider.js";

@Injectable()
class ChatsRepository implements IChatsRepository {
    public constructor(
        @Inject(DB) private readonly database: Db
    ) { }

    public async create(chat: ChatModel): Promise<ChatModel> {
        throw new Error("Method not implemented.");
    }

    public async getById(id: number): Promise<ChatModel | null> {
        const candidate = await this.database.orm.public.Chat.where({ id }).first();
        if (candidate === null) return null;
        else return ChatModel.fromStorage(candidate.id, candidate.name, candidate.description);
    }

    public async getByName(name: string): Promise<ChatModel | null> {
        throw new Error("Method not implemented.");
    }

    public async update(chat: ChatModel): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async delete(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

export const CHATS_REPOSITORY_PROVIDER: Provider = {
    provide: CHATS_REPOSITORY_TOKEN,
    useClass: ChatsRepository
}