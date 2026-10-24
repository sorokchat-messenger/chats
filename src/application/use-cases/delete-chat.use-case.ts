import { Inject, Injectable } from "@nestjs/common";
import { CHAT_REPOSITORY_TOKEN, ChatNotFoundException, Id, MemberNotAdminException, type IChatRepository } from "../../domain/index.js";
import type { DeleteChatRequest, DeleteChatResponse } from '../payloads/index.js';

@Injectable()
export class DeleteChatUseCase {
    public constructor(@Inject(CHAT_REPOSITORY_TOKEN) private readonly repository: IChatRepository) { }

    public async execute(payload: DeleteChatRequest): Promise<DeleteChatResponse> {
        const chat = await this.repository.findById(Id.of(payload.id));
        if (chat === null) throw new ChatNotFoundException();
        if (!chat.hasAdmin(Id.of(payload.actorId))) throw new MemberNotAdminException();
        return await this.repository.delete(chat.id);
    }
}