import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs";
import { RemoveMemberCommand } from "./command.js";
import { CHAT_REPOSITORY_TOKEN, ChatNotFoundException, Id, type IChatRepository } from "../../../domain/index.js";
import { Inject } from "@nestjs/common";

export type RemoveMemberResult = void;

@CommandHandler(RemoveMemberCommand)
export class RemoveMemberHandler implements ICommandHandler<RemoveMemberCommand, RemoveMemberResult> {
    public constructor(@Inject(CHAT_REPOSITORY_TOKEN) private readonly repository: IChatRepository) { }

    public async execute(command: RemoveMemberCommand): Promise<void> {
        const chat = await this.repository.findById(Id.of(command.chatId));
        if (chat === null) throw new ChatNotFoundException();
        return await this.repository.save(chat.removeMember(Id.of(command.actorId), Id.of(command.userId)));
    }
}