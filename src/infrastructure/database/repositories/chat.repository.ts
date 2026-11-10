import { Injectable, type Provider } from "@nestjs/common";
import { PrismaService } from "../prisma/index.js";
import { ChatMapper } from "../mappers/chat.mapper.js";
import { Chat, CHAT_REPOSITORY_TOKEN, IChatRepository, type Id } from "../../../domain/index.js";
import { Participant, type ChatRole } from "@prisma/client";

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
        if (chat.isDeleted) {
            await this.prisma.chat.deleteMany({ where: { id: chat.id.value } });
        } else if (chat.isCreated) {
            await this.prisma.chat.create({
                data: {
                    id: chat.id.value,
                    name: chat.name,
                    description: chat.description ?? undefined,
                    participants: {
                        createMany: {
                            data: chat.participants.map(participant => ({
                                userId: participant.id.userId.value,
                                role: participant.role.value as ChatRole
                            }))
                        }
                    }
                }
            });
        } else if (chat.isUpdated) {
            await this.prisma.$transaction(async transaction => {
                const updateParticipants = async (chat: Chat): Promise<void> => {
                    const indexesToDelete: { chatId: string, userId: string }[] = [];
                    const dataToCreate: Participant[] = [];
                    for (const participant of chat.participants) {
                        if (participant.isDeleted) {
                            indexesToDelete.push({ chatId: participant.id.chatId.value, userId: participant.id.userId.value });
                        } else if (participant.isCreated) {
                            dataToCreate.push({
                                userId: participant.id.userId.value,
                                chatId: participant.id.chatId.value,
                                role: participant.role.value as ChatRole
                            });
                        } else if (participant.isUpdated) {
                            await transaction.participant.update({
                                where: { userId_chatId: { chatId: participant.id.chatId.value, userId: participant.id.userId.value } },
                                data: {
                                    role: participant.role.value as ChatRole
                                }
                            });
                        }
                    }
                    if (indexesToDelete.length) {
                        await transaction.participant.deleteMany({
                            where: {
                                OR: indexesToDelete.map(({ chatId, userId }) => ({
                                    chatId,
                                    userId
                                }))
                            }
                        });
                    }
                    if (dataToCreate.length) {
                        await transaction.participant.createMany({
                            data: dataToCreate
                        });
                    }
                }
                return await Promise.all(
                    [
                        transaction.chat.update({
                            where: {
                                id: chat.id.value
                            },
                            data: {
                                name: chat.name,
                                description: chat.description
                            }
                        }),
                        updateParticipants(chat)
                    ]
                );
            });
        }
    }

    public async findById(id: Id): Promise<Chat | null> {
        const candidate = await this.prisma.chat.findUnique({ where: { id: id.value }, include: { participants: true } });
        if (!candidate) return null;
        return this.mapper.toModel(candidate);
    }
}

export const CHAT_REPOSITORY_PROVIDER: Provider = {
    provide: CHAT_REPOSITORY_TOKEN,
    useClass: ChatRepository
}