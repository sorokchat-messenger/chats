export class RemoveMemberCommand {
    public constructor(
        public readonly chatId: string,
        public readonly actorId: string,
        public readonly userId: string
    ) { }
}