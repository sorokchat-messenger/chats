import { Participant } from "./participant.model.js";
import { ChatRole } from "@sorokchat-messenger/contracts";
import { Id } from "./id.model.js";
import {
    NotSelfException,
    MemberAlreadyExistsException,
    MemberNotAdminException,
    MemberNotFoundException,
    LastAdminException
} from "../exception/index.js";

export class Chat {
    private readonly _id: Id;
    private _name: string;
    private _description: string | null;
    private _participants: Participant[];

    private constructor(id: Id, name: string, description: string | null, participants: Participant[]) {
        this._id = id;
        this._name = name;
        this._description = description;
        this._participants = [...participants];
    }

    public get id(): Id {
        return this._id.clone();
    }

    public get name(): string {
        return this._name;
    }

    public changeName(name: string): Chat {
        this._name = name;
        return this;
    }

    public get description(): string | null {
        return this._description;
    }

    public clearDescription(): Chat {
        this._description = null;
        return this;
    }

    public changeDescription(description: string): Chat {
        this._description = description;
        return this;
    }

    public get participants(): Participant[] {
        return this._participants.map(participant => participant.clone());
    }

    public hasAdmin(userId: Id): boolean {
        const participant = this.getParticipant(userId);
        return participant !== null ? participant.isAdmin : false;
    }

    public hasMember(userId: Id): boolean {
        const participant = this.getParticipant(userId);
        return participant !== null ? participant.isMember : false;
    }

    public hasParticipant(userId: Id): boolean {
        return this.getParticipant(userId) !== null;
    }

    public addMember(actorId: Id, userId: Id): Chat {
        if (actorId.equal(userId)) throw new NotSelfException();
        if (!this.hasAdmin(actorId)) throw new MemberNotAdminException();
        if (this.hasParticipant(userId)) throw new MemberAlreadyExistsException();
        this._participants.push(Participant.create(userId, this._id));
        return this;
    }

    public removeMember(actorId: Id, userId: Id): Chat {
        if (actorId.equal(userId)) throw new NotSelfException();
        if (!this.hasAdmin(actorId)) throw new MemberNotAdminException();
        if (!this.hasParticipant(userId)) throw new MemberNotFoundException();
        this._participants = this._participants.filter(participant => !participant.userId.equal(userId));
        return this;
    }

    public leave(actorId: Id): Chat {
        const participant = this.getParticipant(actorId);
        if (participant === null) throw new MemberNotFoundException();
        if (participant.isAdmin && this.countOfAdmins <= 1) throw new LastAdminException();
        this._participants = this._participants.filter(old => !old.equal(participant));
        return this;
    }

    public changeRole(actorId: Id, userId: Id, role: ChatRole): Chat {
        if (actorId.equal(userId)) throw new NotSelfException();
        if (!this.hasAdmin(actorId)) throw new MemberNotAdminException();
        const participant = this.getParticipant(userId);
        if (participant === null) throw new MemberNotFoundException();
        participant.changeRole(role);
        return this;
    }

    private get countOfAdmins(): number {
        return this._participants.filter(participant => participant.isAdmin).length;
    }

    private getParticipant(userId: Id): Participant | null {
        return this._participants.find(participant => participant.userId.equal(userId) && participant.chatId.equal(this._id)) || null;
    }

    public equal(other: Chat): boolean {
        return this._id.equal(other.id);
    }

    public clone(): Chat {
        return Chat.restore(this.id, this.name, this.description, this.participants);
    }

    public static create(name: string, description: string | null, actorId: Id): Chat {
        const id: Id = Id.create();
        return new Chat(id, name, description, [Participant.create(actorId, id, ChatRole.ADMIN)]);
    }

    public static restore(id: Id, name: string, description: string | null, participants: Participant[]): Chat {
        return new Chat(id, name, description, participants.map(participant => participant.clone()));
    }
}