import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CHATS_REPOSITORY_TOKEN, type IChatsRepository } from './chats.repository.js';
import {
    type CreateChatResponse,
    type CreateChatRequest,
    type UpdateChatRequest,
    GrpcStatus,
    type DeleteChatRequest,
    type AddMemberToChatRequest,
    type RemoveMemberFromChatRequest,
    type GrantMemberRequest,
    type RevokeMemberRequest
} from '@sorokchat-messenger/microservices';
import { ChatModel } from './chat.model.js';

@Injectable()
export class ChatsService {
    public constructor(@Inject(CHATS_REPOSITORY_TOKEN) private readonly repository: IChatsRepository) { }

    public async create(payload: CreateChatRequest): Promise<CreateChatResponse> {
        const chat = ChatModel.create(payload.name, payload.actorId, payload.description);
        return await this.repository.create(chat);
    }

    public async update(payload: UpdateChatRequest): Promise<void> {
        const chat = await this.getChatById(payload.id);
        if (payload.name) {
            chat.name = payload.name;
        }
        if (payload.description) {
            chat.description = payload.description;
        }
        await this.repository.update(chat);
    }

    public async delete(payload: DeleteChatRequest): Promise<void> {
        const chat = await this.getChatById(payload.id);
        const isAdmin = chat.hasAdmin(payload.actorId);
        if (isAdmin === false) throw new RpcException({ code: GrpcStatus.NOT_FOUND, message: "errors.chat.access-denied" });
        await this.repository.delete(payload.id);
    }

    public async addMember(payload: AddMemberToChatRequest): Promise<void> {
        const chat = await this.getChatById(payload.chatId);
        chat.addUser(payload.actorId, payload.userId);
        await this.repository.update(chat);
    }

    public async removeMember(payload: RemoveMemberFromChatRequest): Promise<void> {
        const chat = await this.getChatById(payload.chatId);
        chat.removeUser(payload.actorId, payload.userId);
        await this.repository.update(chat);
    }

    public async grandMember(payload: GrantMemberRequest): Promise<void> {
        const chat = await this.getChatById(payload.chatId);
        chat.grant(payload.actorId, payload.userId);
        await this.repository.update(chat);
    }

    public async revokeMember(payload: RevokeMemberRequest): Promise<void> {
        const chat = await this.getChatById(payload.chatId);
        chat.revoke(payload.actorId, payload.userId);
        await this.repository.update(chat);
    }

    private async getChatById(id: string): Promise<ChatModel> {
        const chat = await this.repository.getById(id);
        if (chat === null) throw new RpcException({ code: GrpcStatus.NOT_FOUND, message: "errors.chat.not-found" });
        return chat;
    }
}
