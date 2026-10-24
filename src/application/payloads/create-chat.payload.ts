export interface CreateChatRequest {
    readonly name: string;
    readonly description: string | null;
    readonly actorId: string;
}

export interface CreateChatResponse {
    id: string;
}