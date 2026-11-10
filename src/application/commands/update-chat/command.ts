export class UpdateChatCommand {
    public constructor(
        public readonly id: string,
        public readonly name: string | null,
        public readonly description: string | null,
        public readonly actorId: string,
    ) { }
}