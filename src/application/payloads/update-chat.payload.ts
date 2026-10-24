export interface UpdateChatRequest {
    id: string;
    name?: string;
    description?: string;
    actorId: string;
}

export type UpdateChatResponse = void;