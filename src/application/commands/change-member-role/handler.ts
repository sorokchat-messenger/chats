import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs";
import { ChangeMemberRoleCommand } from "./command.js";
import { CHAT_REPOSITORY_TOKEN, ChatNotFoundException, Id, Role, type IChatRepository } from "../../../domain/index.js";
import { Inject } from "@nestjs/common";

export type ChangeMemberRoleResult = void;

@CommandHandler(ChangeMemberRoleCommand)
export class ChangeMemberRoleHandler implements ICommandHandler<ChangeMemberRoleCommand, ChangeMemberRoleResult> {
    public constructor(@Inject(CHAT_REPOSITORY_TOKEN) private readonly repository: IChatRepository) { }

    public async execute(command: ChangeMemberRoleCommand): Promise<void> {
        const chat = await this.repository.findById(Id.of(command.chatId));
        if (chat === null) throw new ChatNotFoundException();
        return await this.repository.save(chat.changeRole(Id.of(command.actorId), Id.of(command.userId), Role.of(command.role)));
    }
}