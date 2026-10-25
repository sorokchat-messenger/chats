import { Injectable, type Provider } from "@nestjs/common";
import { PrismaService } from "../prisma/index.js";
import { ChatMapper } from "../mappers/chat.mapper.js";
import { Chat, CHAT_REPOSITORY_TOKEN, IChatRepository, Id } from "../../../domain/index.js";

@Injectable()
class ChatRepository implements IChatRepository {
    public constructor(
        private readonly prisma: PrismaService,
        private readonly mapper: ChatMapper
    ) { }

    public async findByName(name: string, actorId: Id, limit: number, offset: number): Promise<Chat[]> {
        const chats = await this.prisma.chat.findMany({
            where: {
                AND: {
                    name: {
                        mode: 'insensitive',
                        contains: name
                    },
                    participants: {
                        some: {
                            userId: actorId.value
                        }
                    }
                }
            },
            take: limit,
            skip: offset,
            include: { participants: true }
        });
        return chats.map(chat => this.mapper.toModel(chat));
    }

    public async findByUser(userId: Id, limit: number, offset: number): Promise<Chat[]> {
        const chats = await this.prisma.chat.findMany({
            where: {
                participants: {
                    some: {
                        userId: userId.value
                    }
                }
            },
            take: limit,
            skip: offset,
            include: { participants: true }
        });
        return chats.map(chat => this.mapper.toModel(chat));
    }

    public async save(chat: Chat): Promise<void> {
        const data = this.mapper.toPersistence(chat);
        const participantIds = data.participants.map(participant => participant.id);
        await this.prisma.$transaction(async transaction => {
            await transaction.chat.upsert({
                where: { id: data.id },
                create: {
                    id: data.id,
                    name: data.name,
                    description: data.description
                },
                update: {
                    name: data.name,
                    description: data.description
                }
            });
            await transaction.participant.deleteMany({
                where: {
                    chatId: data.id,
                    id: { notIn: participantIds }
                }
            });
            await Promise.all(data.participants.map(participant => {
                return transaction.participant.upsert({
                    where: { id: participant.id },
                    create: {
                        id: participant.id,
                        userId: participant.userId,
                        chatId: participant.chatId,
                        role: participant.role
                    },
                    update: {
                        role: participant.role
                    }
                });
            }));
        });
    }

    public async findById(id: Id): Promise<Chat | null> {
        const candidate = await this.prisma.chat.findUnique({ where: { id: id.value }, include: { participants: true } });
        if (!candidate) return null;
        return this.mapper.toModel(candidate);
    }

    public async delete(id: Id): Promise<void> {
        await this.prisma.chat.deleteMany({ where: { id: id.value } });
    }
}

export const CHAT_REPOSITORY_PROVIDER: Provider = {
    provide: CHAT_REPOSITORY_TOKEN,
    useClass: ChatRepository
}