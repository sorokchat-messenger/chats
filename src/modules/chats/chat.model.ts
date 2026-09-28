import { ParticipantModel } from "./participant.model";

export class ChatModel {
    private readonly _id: number;
    private _name: string;
    private _description: string | null;
    private readonly _participants: ParticipantModel[];

    public get id(): number {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get description(): string | null {
        return this._description;
    }

    public get participants(): ParticipantModel[] {
        return [...this._participants];
    }

    public get countOfAdmins(): number {
        return this._participants.filter(participant => participant.isAdmin).length;
    }

    public get countOfMembers(): number {
        return this._participants.filter(participant => participant.isMember).length;
    }

    public set name(value: string) {
        this._name = value;
    }

    public set description(value: string) {
        this._description = value;
    }

    public clearDescription(): void {
        this._description = null;
    }

    public static create(name: string, adminId: number, description: string | null = null): ChatModel {
        return new ChatModel(null!, name, [ParticipantModel.createAdmin(adminId)], description);
    }

    public static fromStorage(id: number, name: string, participants: ParticipantModel[], description: string | null = null): ChatModel {
        return new ChatModel(id, name, participants, description);
    }

    private constructor(id: number, name: string, participants: ParticipantModel[], description: string | null) {
        this._id = id;
        this._name = name;
        this._participants = [...participants];
        this._description = description;
    }
}