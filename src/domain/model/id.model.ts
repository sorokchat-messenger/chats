import { uuidv7 } from "uuidv7";
import { NotIdException } from "../exception/index.js";

export class Id {
    private static readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    private readonly _value: string;

    private constructor(value: string) {
        this._value = value;
    }

    public get value(): string {
        return this._value;
    }

    public equal(other?: Id | null): boolean {
        if (!other) return false;
        return this._value === other.value;
    }

    public clone(): Id {
        return Id.of(this._value);
    }

    public static create(): Id {
        return new Id(uuidv7());
    }

    public static of(value?: string | null): Id {
        if (!value || typeof value !== 'string' || value.trim().length === 0 || !this.UUID_REGEX.test(value)) {
            throw new NotIdException();
        }
        return new Id(value);
    }
}