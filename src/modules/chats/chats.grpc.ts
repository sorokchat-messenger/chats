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
import { ChatsService } from './chats.service.js';

@GrpcService(CHATS_SERVICE.NAME)
export class ChatsGrpc {
    public constructor(private readonly service: ChatsService) { }

    @GrpcMethod(CHATS_SERVICE.NAME, CHATS_SERVICE.CREATE_CHAT)
    public async create(@Payload() payload: CreateChatRequest): Promise<CreateChatResponse> {
        return await this.service.create(payload);
    }

    @GrpcMethod(CHATS_SERVICE.NAME, CHATS_SERVICE.UPDATE_CHAT)
    public async update(@Payload() payload: UpdateChatRequest): Promise<void> {
        return await this.service.update(payload);
    }

    @GrpcMethod(CHATS_SERVICE.NAME, CHATS_SERVICE.DELETE_CHAT)
    public async delete(@Payload() payload: DeleteChatRequest): Promise<void> {
        return await this.service.delete(payload);
    }

    @GrpcMethod(CHATS_SERVICE.NAME, CHATS_SERVICE.ADD_MEMBER_TO_CHAT)
    public async addMember(@Payload() payload: AddMemberToChatRequest): Promise<void> {
        return await this.service.addMember(payload);
    }

    @GrpcMethod(CHATS_SERVICE.NAME, CHATS_SERVICE.REMOVE_MEMBER_FROM_CHAT)
    public async removeMember(@Payload() payload: RemoveMemberFromChatRequest): Promise<void> {
        return await this.service.removeMember(payload);
    }

    @GrpcMethod(CHATS_SERVICE.NAME, CHATS_SERVICE.GRANT_MEMBER)
    public async grantMember(@Payload() payload: GrantMemberRequest): Promise<void> {
        return await this.service.grandMember(payload);
    }

    @GrpcMethod(CHATS_SERVICE.NAME, CHATS_SERVICE.REVOKE_MEMBER)
    public async revokeMember(@Payload() payload: RevokeMemberRequest): Promise<void> {
        return await this.service.revokeMember(payload);
    }
}