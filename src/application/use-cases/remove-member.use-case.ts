import { Inject, Injectable } from "@nestjs/common";
import { CHAT_REPOSITORY_TOKEN, ChatNotFoundException, Id, type IChatRepository } from "../../domain/index.js";

export interface RemoveMemberRequest {
    actorId: string;
    userId: string;
    chatId: string;
}

export type RemoveMemberResponse = void;

@Injectable()
export class RemoveMemberUseCase {
    public constructor(@Inject(CHAT_REPOSITORY_TOKEN) private readonly repository: IChatRepository) { }

    public async execute(payload: RemoveMemberRequest): Promise<RemoveMemberResponse> {
        const chat = await this.repository.findById(Id.of(payload.chatId));
        if (chat === null) throw new ChatNotFoundException();
        chat.removeMember(Id.of(payload.actorId), Id.of(payload.userId));
        return await this.repository.save(chat);
    }
}