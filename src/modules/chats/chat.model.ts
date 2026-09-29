import { CHAT_ROLE_HIERARCHY, ChatRole, ChatsCodes } from "@sorokchat-messenger/contracts";
import { ParticipantModel } from "./participant.model";

export class ChatModel {
    private readonly _id: number;
    private _name: string;
    private _description: string | null;
    private _participants: ParticipantModel[];

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

    public addUser(actorId: number, userId: number): void {
        if (actorId === userId) throw new Error("Actor can not add self");
        const actor = this._participants.find(participant => participant.userId === actorId);
        if (!actor) throw Error("actor not found");
        if (!actor.isAdmin) throw new Error("Actor not admin");
        if (this._participants.some(participant => participant.userId === userId)) throw Error("User already in chat");
        this._participants.push(ParticipantModel.createMember(userId));
    }

    public removeUser(actorId: number, memberId: number): void {
        if (actorId === memberId) throw new Error("Actor can not remove self");
        const actor = this._participants.find(participant => participant.userId === actorId);
        if (!actor) throw Error("actor not found");
        if (!actor.isAdmin) throw new Error("Actor not admin");
        const member = this._participants.find(participant => participant.userId === memberId);
        if (!member) throw new Error("User not in chat");
        this._participants = this._participants.filter(participant => participant.userId !== memberId);
    }

    public leave(actorId: number): void {
        const actor = this._participants.find(participant => participant.userId === actorId);
        if (!actor) throw new Error("actor not found");
        if (actor.isAdmin && this.countOfAdmins <= 1) throw new Error("Last admin can not leave chat");
        this._participants = this._participants.filter(participant => participant.userId !== actorId);
    }

    public grant(actorId: number, memberId: number): void {
        if (actorId === memberId) throw new Error("Actor can not grant self");
        const actor = this._participants.find(participant => participant.userId === actorId);
        if (!actor) throw new Error("actor not found");
        if (!actor.isAdmin) throw new Error("Actor not admin");
        const member = this._participants.find(participant => participant.userId === memberId);
        if (!member) throw new Error("User not in chat");
        member.changeRole(ChatRole.ADMIN);
    }

    public revoke(actorId: number, memberId: number): void {
        if (actorId === memberId) throw new Error("Actor can not revole self");
        const actor = this._participants.find(participant => participant.userId === actorId);
        if (!actor) throw new Error("actor not found");
        if (!actor.isAdmin) throw new Error("Actor not admin");
        const member = this._participants.find(participant => participant.userId === memberId);
        if (!member) throw new Error("User not in chat");
        member.changeRole(ChatRole.MEMBER);
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