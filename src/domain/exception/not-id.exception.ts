import { DomainException } from "./domain.exception.js";

export class NotIdException extends DomainException {
    public constructor() {
        super("errors.chat.not-id");
    }
}