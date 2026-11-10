export class AddMemberCommand {
    public constructor(
        public chatId: string,
        public actorId: string,
        public userId: string
    ) { }
}