import { DomainException } from "./domain.exception.js";

export class LastAdminException extends DomainException {
    public constructor() {
        super("errors.chat.last-admin");
    }
}