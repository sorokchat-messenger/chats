import { Id } from "../../../domain/index.js";
import { Mapper } from "./mapper.js";

export class IdMapper implements Mapper<Id, string> {
    public constructor() { }

    public toPersistence(id: Id): string {
        return id.value;
    }

    public toModel(value: string): Id {
        return Id.of(value);
    }
}