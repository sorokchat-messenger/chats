export class GetChatsByUserQuery {
    public constructor(
        public readonly userId: string,
        public readonly limit: number,
        public readonly offset: number
    ) { }
}