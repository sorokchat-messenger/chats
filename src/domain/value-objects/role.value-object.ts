import { NotRoleException } from "../exception/index.js";
import { ValueObject } from "./value-object.js";

export class Role extends ValueObject<Role> {
    private readonly _value: string;

    private constructor(value: string) {
        super();
        this._value = value;
    }

    public static get MEMBER(): Role {
        return new Role("MEMBER");
    }

    public static get ADMIN(): Role {
        return new Role("ADMIN");
    }

    public static of(value: string): Role {
        const candidate = this.ALL.find(role => role.value === value);
        if (!candidate) throw new NotRoleException();
        return candidate;
    }

    public get value(): string {
        return this._value;
    }

    public clone(): Role {
        return new Role(this.value);
    }

    private static get ALL(): Role[] {
        return [this.MEMBER, this.ADMIN];
    }
}