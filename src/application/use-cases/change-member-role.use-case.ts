import { Inject, Injectable } from "@nestjs/common";
import { CHAT_REPOSITORY_TOKEN, ChatNotFoundException, Id, type IChatRepository } from "../../domain/index.js";
import { ChatRole } from "../../infrastructure/database/generated/prisma/enums.js";

export interface ChangeMemberRoleRequest {
    chatId: string;
    actorId: string;
    userId: string;
    role: ChatRole;
}

export type ChangeMemberRoleResponse = void;

@Injectable()
export class ChangeMemberRoleUseCase {
    public constructor(@Inject(CHAT_REPOSITORY_TOKEN) private readonly repository: IChatRepository) { }

    public async execude(payload: ChangeMemberRoleRequest): Promise<ChangeMemberRoleResponse> {
        const chat = await this.repository.findById(Id.of(payload.chatId));
        if (chat === null) throw new ChatNotFoundException();
        return await this.repository.save(chat.changeRole(Id.of(payload.actorId), Id.of(payload.userId), payload.role));
    }
}