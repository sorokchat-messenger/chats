export class GetChatsByNameQuery {
    public constructor(
        public readonly name: string,
        public readonly limit: number,
        public readonly offset: number,
        public readonly actorId: string
    ) { }
}