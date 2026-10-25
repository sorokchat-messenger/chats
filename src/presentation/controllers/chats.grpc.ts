import { GrpcMethod, GrpcService, Payload } from '@nestjs/microservices';
import {
    CHATS_SERVICE,
    type UpdateChatRequest,
    type CreateChatRequest,
    type CreateChatResponse,
    type DeleteChatRequest,
    type AddMemberToChatRequest,
    type RemoveMemberFromChatRequest,
    type GrantMemberRequest,
    type RevokeMemberRequest,
    type GetChatsByNameRequest,
    type GetChatsByNameResponse,
    type ChatResponse,
    type ChatRole,
    type GetChatsByUserResponse,
    type GetChatsByUserRequest,
} from '@sorokchat-messenger/microservices';
import {
    AddMemberUseCase,
    ChangeMemberRoleUseCase,
    CreateChatUseCase,
    DeleteChatUseCase,
    GetChatsByNameUseCase,
    GetChatsByUserUseCase,
    RemoveMemberUseCase,
    UpdateChatUseCase,
} from '../../application/index.js';
import { Chat, Id, Role } from '../../domain/index.js';

const DEFAULT_LIMIT: number = 10;
const DEFAULT_OFFSET: number = 0;

@GrpcService(CHATS_SERVICE.NAME)
export class ChatsGrpc {
    public constructor(
        private readonly getChatsByNameUseCase: GetChatsByNameUseCase,
        private readonly getChatsByUserUseCase: GetChatsByUserUseCase,
        private readonly createChatUseCase: CreateChatUseCase,
        private readonly updateChatUseCase: UpdateChatUseCase,
        private readonly deleteChatUseCase: DeleteChatUseCase,
        private readonly addMemberUseCase: AddMemberUseCase,
        private readonly removeMemberUseCase: RemoveMemberUseCase,
        private readonly changeMemberRoleUseCase: ChangeMemberRoleUseCase
    ) { }

    @GrpcMethod(CHATS_SERVICE.NAME, CHATS_SERVICE.GET_CHATS_BY_NAME)
    public async getByName(@Payload() payload: GetChatsByNameRequest): Promise<GetChatsByNameResponse> {
        const response = await this.getChatsByNameUseCase.execute({
            actorId: Id.of(payload.actorId),
            limit: payload.limit || DEFAULT_LIMIT,
            name: payload.name,
            offset: payload.offset || DEFAULT_OFFSET
        });
        return { chats: response.chats.map(chat => this.toPresentation(chat)) }
    }

    @GrpcMethod(CHATS_SERVICE.NAME, CHATS_SERVICE.GET_CHATS_BY_USER)
    public async getByUser(@Payload() payload: GetChatsByUserRequest): Promise<GetChatsByUserResponse> {
        const response = await this.getChatsByUserUseCase.execute({
            limit: payload.limit || DEFAULT_LIMIT,
            offset: payload.offset || DEFAULT_OFFSET,
            userId: Id.of(payload.userId)
        });
        return { chats: response.chats.map(chat => this.toPresentation(chat)) }
    }

    @GrpcMethod(CHATS_SERVICE.NAME, CHATS_SERVICE.CREATE_CHAT)
    public async create(@Payload() payload: CreateChatRequest): Promise<CreateChatResponse> {
        return await this.createChatUseCase.execute(payload);
    }

    @GrpcMethod(CHATS_SERVICE.NAME, CHATS_SERVICE.UPDATE_CHAT)
    public async update(@Payload() payload: UpdateChatRequest): Promise<void> {
        return await this.updateChatUseCase.execute(payload);
    }

    @GrpcMethod(CHATS_SERVICE.NAME, CHATS_SERVICE.DELETE_CHAT)
    public async delete(@Payload() payload: DeleteChatRequest): Promise<void> {
        return await this.deleteChatUseCase.execute(payload);
    }

    @GrpcMethod(CHATS_SERVICE.NAME, CHATS_SERVICE.ADD_MEMBER_TO_CHAT)
    public async addMember(@Payload() payload: AddMemberToChatRequest): Promise<void> {
        return await this.addMemberUseCase.execute(payload);
    }

    @GrpcMethod(CHATS_SERVICE.NAME, CHATS_SERVICE.REMOVE_MEMBER_FROM_CHAT)
    public async removeMember(@Payload() payload: RemoveMemberFromChatRequest): Promise<void> {
        return this.removeMemberUseCase.execute(payload);
    }

    @GrpcMethod(CHATS_SERVICE.NAME, CHATS_SERVICE.GRANT_MEMBER)
    public async grantMember(@Payload() payload: GrantMemberRequest): Promise<void> {
        return await this.changeMemberRoleUseCase.execude({
            actorId: payload.actorId,
            chatId: payload.chatId,
            userId: payload.userId,
            role: payload.role as Role
        })
    }

    @GrpcMethod(CHATS_SERVICE.NAME, CHATS_SERVICE.REVOKE_MEMBER)
    public async revokeMember(@Payload() payload: RevokeMemberRequest): Promise<void> {
        return await this.changeMemberRoleUseCase.execude({
            actorId: payload.actorId,
            chatId: payload.chatId,
            userId: payload.userId,
            role: Role.MEMBER
        })
    }

    private toPresentation(chat: Chat): ChatResponse {
        return {
            id: chat.id.value,
            description: chat.description || chat.name,
            name: chat.name,
            participants: chat.participants.map(participant => ({
                displayName: participant.userId.value,
                login: participant.userId.value,
                role: participant.role as ChatRole,
                userId: participant.userId.value
            }))
        }
    }
}