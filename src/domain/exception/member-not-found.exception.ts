import { DomainException } from "./domain.exception.js";

export class MemberNotFoundException extends DomainException {
    public constructor() {
        super("errors.chat.member.not-found");
    }
}