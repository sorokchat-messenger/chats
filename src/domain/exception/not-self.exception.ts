import { DomainException } from "./domain.exception.js";

export class NotSelfException extends DomainException {
    public constructor() {
        super("errors.chat.member.self");
    }
}