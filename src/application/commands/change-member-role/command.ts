export class ChangeMemberRoleCommand {
    public constructor(
        public readonly chatId: string,
        public readonly actorId: string,
        public readonly userId: string,
        public readonly role: string
    ) { }
}