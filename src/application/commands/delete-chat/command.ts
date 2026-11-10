export class DeleteChatCommand {
    public constructor(
        public readonly actorId: string,
        public readonly chatId: string
    ) { }
}