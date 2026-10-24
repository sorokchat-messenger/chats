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
    type RevokeMemberRequest
} from '@sorokchat-messenger/microservices';
import {
    AddMemberUseCase,
    ChangeMemberRoleUseCase,
    CreateChatUseCase,
    DeleteChatUseCase,
    RemoveMemberUseCase,
    UpdateChatUseCase
} from '../../application/index.js';
import { ChatRole } from '@sorokchat-messenger/contracts';

@GrpcService(CHATS_SERVICE.NAME)
export class ChatsGrpc {
    public constructor(
        private readonly createChatUseCase: CreateChatUseCase,
        private readonly updateChatUseCase: UpdateChatUseCase,
        private readonly deleteChatUseCase: DeleteChatUseCase,
        private readonly addMemberUseCase: AddMemberUseCase,
        private readonly removeMemberUseCase: RemoveMemberUseCase,
        private readonly changeMemberRoleUseCase: ChangeMemberRoleUseCase
    ) { }

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
            role: payload.role as ChatRole
        })
    }

    @GrpcMethod(CHATS_SERVICE.NAME, CHATS_SERVICE.REVOKE_MEMBER)
    public async revokeMember(@Payload() payload: RevokeMemberRequest): Promise<void> {
        return await this.changeMemberRoleUseCase.execude({
            actorId: payload.actorId,
            chatId: payload.chatId,
            userId: payload.userId,
            role: ChatRole.MEMBER
        })
    }
}