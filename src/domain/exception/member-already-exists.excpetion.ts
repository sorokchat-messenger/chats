import { DomainException } from "./domain.exception.js";

export class MemberAlreadyExistsException extends DomainException {
    public constructor() {
        super("errors.chat.member.exists");
    }
}