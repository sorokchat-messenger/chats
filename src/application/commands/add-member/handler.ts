import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs";
import { AddMemberCommand } from "./command.js";
import { Inject } from "@nestjs/common";
import { CHAT_REPOSITORY_TOKEN, ChatNotFoundException, Id, type IChatRepository } from "../../../domain/index.js";

export type AddMemberResult = void;

@CommandHandler(AddMemberCommand)
export class AddMemberHandler implements ICommandHandler<AddMemberCommand, AddMemberResult> {
    public constructor(@Inject(CHAT_REPOSITORY_TOKEN) private readonly repository: IChatRepository) { }

    public async execute(command: AddMemberCommand): Promise<void> {
        const chat = await this.repository.findById(Id.of(command.chatId));
        if (chat === null) throw new ChatNotFoundException();
        return await this.repository.save(chat.addMember(Id.of(command.actorId), Id.of(command.userId)));
    }
}