import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs";
import { DeleteChatCommand } from "./command.js";
import { CHAT_REPOSITORY_TOKEN, ChatNotFoundException, Id, type IChatRepository } from "../../../domain/index.js";
import { Inject } from "@nestjs/common";

export type DeleteChatResult = void;

@CommandHandler(DeleteChatCommand)
export class DeleteChatHandler implements ICommandHandler<DeleteChatCommand, DeleteChatResult> {
    public constructor(@Inject(CHAT_REPOSITORY_TOKEN) private readonly repository: IChatRepository) { }

    public async execute(command: DeleteChatCommand): Promise<void> {
        const chatId = Id.of(command.chatId);
        const chat = await this.repository.findById(chatId);
        if (chat === null) throw new ChatNotFoundException();
        return await this.repository.save(chat.delete(Id.of(command.actorId)));
    }
}