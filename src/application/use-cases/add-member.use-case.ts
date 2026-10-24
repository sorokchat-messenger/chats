import { Inject, Injectable } from "@nestjs/common";
import { CHAT_REPOSITORY_TOKEN, ChatNotFoundException, Id, type IChatRepository } from "../../domain/index.js";

export interface AddMemberRequest {
    actorId: string;
    userId: string;
    chatId: string;
}

export type AddMemberResponse = void;

@Injectable()
export class AddMemberUseCase {
    public constructor(@Inject(CHAT_REPOSITORY_TOKEN) private readonly repository: IChatRepository) { }

    public async execute(payload: AddMemberRequest): Promise<AddMemberResponse> {
        const chat = await this.repository.findById(Id.of(payload.chatId));
        if (chat === null) throw new ChatNotFoundException();
        chat.addMember(Id.of(payload.actorId), Id.of(payload.userId));
        return await this.repository.save(chat);
    }
}