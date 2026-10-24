import { DomainException } from "./domain.exception.js";

export class MemberNotAdminException extends DomainException {
    public constructor() {
        super("errors.chat.not-admin");
    }
}