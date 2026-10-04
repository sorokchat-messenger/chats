import { ChatRole } from "@sorokchat-messenger/contracts";
import { ParticipantModel } from "./participant.model";
import { uuidv7 } from "uuidv7";

export class ChatModel {
    private readonly _id: string;
    private _name: string;
    private _description: string | null;
    private _participants: ParticipantModel[];

    public get id(): string {
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

    public addUser(actorId: string, userId: string): void {
        if (actorId === userId) throw new Error("actor can not add self");
        if (!this.hasAdmin(actorId)) throw new Error("Actor not admin");
        if (this.hasParticipant(userId)) throw new Error("User already in chat");
        this._participants.push(ParticipantModel.createMember(userId));
    }

    public removeUser(actorId: string, memberId: string): void {
        if (actorId === memberId) throw new Error("actor can not remove self");
        if (!this.hasAdmin(actorId)) throw new Error("Actor not admin");
        if (!this.hasParticipant(memberId)) throw new Error("User not in chat");
        this._participants = this._participants.filter(participant => participant.userId !== memberId);
    }

    public leave(actorId: string): void {
        const actor = this.getParticipant(actorId);
        if (actor.isAdmin && this.countOfAdmins <= 1) throw new Error("Last admin can not leave chat");
        this._participants = this._participants.filter(participant => participant.userId !== actorId);
    }

    public grant(actorId: string, memberId: string): void {
        if (actorId === memberId) throw new Error("actor can not grant self");
        if (!this.hasAdmin(actorId)) throw new Error("Actor not admin");
        const member = this.getParticipant(memberId);
        member.changeRole(ChatRole.ADMIN);
    }

    public revoke(actorId: string, memberId: string): void {
        if (actorId === memberId) throw new Error("actor can not revoke self");
        if (!this.hasAdmin(actorId)) throw new Error("Actor not admin");
        const member = this.getParticipant(memberId);
        member.changeRole(ChatRole.MEMBER);
    }

    public static create(name: string, adminId: string, description: string | null = null): ChatModel {
        return new ChatModel(uuidv7(), name, [ParticipantModel.createAdmin(adminId)], description);
    }

    public static fromStorage(id: string, name: string, participants: ParticipantModel[], description: string | null = null): ChatModel {
        return new ChatModel(id, name, participants, description);
    }

    private constructor(id: string, name: string, participants: ParticipantModel[], description: string | null) {
        this._id = id;
        this._name = name;
        this._participants = [...participants];
        this._description = description;
    }

    private hasAdmin(userId: string): boolean {
        return this._participants.some(participant => participant.userId === userId && participant.isAdmin);
    }

    private hasParticipant(userId: string): boolean {
        return this._participants.some(participant => participant.userId === userId);
    }

    private getParticipant(userId: string): ParticipantModel {
        const participant = this._participants.find(participant => participant.userId === userId);
        if (!participant) throw new Error("Participant not found");
        return participant;
    }
}