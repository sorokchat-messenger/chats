import { uuidv7 } from "uuidv7";
import { NotIdException } from "../exception/index.js";
import { ValueObject } from "./value-object.js";

export class Id extends ValueObject<Id> {
    private static readonly PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    private readonly _value: string;

    private constructor(value: string) {
        super();
        this._value = value;
    }

    public get value(): string {
        return this._value;
    }

    public clone(): Id {
        return Id.of(this._value);
    }

    public static create(): Id {
        return new Id(uuidv7());
    }

    public static of(value?: string | null): Id {
        if (!value || typeof value !== 'string' || !value.trim().length || !this.PATTERN.test(value)) {
            throw new NotIdException();
        }
        return new Id(value);
    }
}