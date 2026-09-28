import { Injectable, Provider } from "@nestjs/common";
import { ChatModel, CHATS_REPOSITORY_TOKEN, ParticipantModel, type IChatsRepository } from "../../../modules/chats/index.js";
import { ILike, Repository } from "typeorm";
import { ChatEntity } from "../entities/index.js";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
class ChatsRepository implements IChatsRepository {
    public constructor(
        @InjectRepository(ChatEntity)
        private readonly repository: Repository<ChatEntity>
    ) { }

    public async create(chat: ChatModel): Promise<ChatModel> {
        const entity = this.repository.create({ name: chat.name, description: chat.description });
        const saved = await this.repository.save(entity);
        return this.toModel(saved);
    }

    public async getById(id: number): Promise<ChatModel | null> {
        const candidate = await this.repository.findOneBy({ id });
        return candidate ? this.toModel(candidate) : null;
    }

    public async getByName(name: string, limit: number, offset: number): Promise<ChatModel[]> {
        const chats = await this.repository.find({
            where: {
                name: ILike(name)
            },
            order: { name: "ASC" },
            skip: offset,
            take: limit
        });
        return chats.map(chat => this.toModel(chat));
    }

    public async update(chat: ChatModel): Promise<ChatModel | null> {
        await this.repository.update(chat.id, { name: chat.name, description: chat.description });
        return await this.getById(chat.id);
    }

    public async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }

    private toModel(entity: ChatEntity): ChatModel {
        return ChatModel.fromStorage(
            entity.id,
            entity.name,
            entity.participants.map(
                participant => ParticipantModel.fromStorage(
                    participant.id,
                    participant.userId,
                    participant.role
                )
            ),
            entity.description
        );
    }
}

export const CHATS_REPOSITORY_PROVIDER: Provider = {
    provide: CHATS_REPOSITORY_TOKEN,
    useClass: ChatsRepository
}