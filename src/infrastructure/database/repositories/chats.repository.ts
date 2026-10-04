import { Injectable, type Provider } from "@nestjs/common";
import { ChatModel, CHATS_REPOSITORY_TOKEN, ParticipantModel, type IChatsRepository } from "../../../modules/chats/index.js";
import { PrismaService } from "../prisma/index.js";
import { type Participant, type Chat } from "../../../generated/prisma/client.js";

export type ChatEntity = Chat & {
    participants: Participant[];
}

@Injectable()
class ChatsRepository implements IChatsRepository {
    public constructor(private readonly prisma: PrismaService) { }

    public async create(chat: ChatModel): Promise<ChatModel> {
        const created = await this.prisma.chat.create({
            data: {
                name: chat.name,
                description: chat.description,
                id: chat.id,
                participants: {
                    createMany: {
                        data: chat.participants.map(participant => ({
                            id: participant.id,
                            userId: participant.userId,
                            role: participant.role
                        }))
                    }
                }
            }, include: { participants: true }
        });
        return this.toModel(created);
    }

    public async getById(id: string): Promise<ChatModel | null> {
        const candidate = await this.prisma.chat.findUnique({ where: { id }, include: { participants: true } });
        return candidate ? this.toModel(candidate) : null;
    }

    public async getByName(name: string, limit: number, offset: number): Promise<ChatModel[]> {
        const chats = await this.prisma.chat.findMany({
            where: {
                name: {
                    contains: name,
                    mode: 'insensitive',
                }
            },
            skip: offset,
            take: limit,
            orderBy: { id: "asc" },
            include: { participants: true }
        });
        return chats.map(chat => this.toModel(chat));
    }

    public async update(chat: ChatModel): Promise<ChatModel | null> {
        const incomingUserIds = chat.participants.map(participant => participant.userId);
        const updated = await this.prisma.$transaction(async transaction => {
            const exists = await transaction.chat.findUnique({ where: { id: chat.id }, select: { id: true } });
            if (!exists) return null;
            await transaction.participant.deleteMany({
                where: {
                    chatId: chat.id,
                    userId: { notIn: incomingUserIds }
                }
            });
            for (const participant of chat.participants) {
                await transaction.participant.upsert({
                    where: {
                        chatId_userId: {
                            chatId: chat.id,
                            userId: participant.userId
                        }
                    },
                    create: {
                        id: participant.id,
                        chatId: chat.id,
                        userId: participant.userId,
                        role: participant.role
                    },
                    update: {
                        role: participant.role
                    }
                });
            }
            return transaction.chat.update({
                where: { id: chat.id },
                data: {
                    name: chat.name,
                    description: chat.description,
                },
                include: { participants: true }
            });
        });
        return updated ? this.toModel(updated) : null;
    }

    public async delete(id: string): Promise<void> {
        await this.prisma.chat.deleteMany({ where: { id } });
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