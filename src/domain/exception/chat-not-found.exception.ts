import { DomainException } from "./domain.exception.js";

export class ChatNotFoundException extends DomainException {
    public constructor() {
        super("errors.chat.not-found");
    }
}