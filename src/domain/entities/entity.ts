import { ValueObject } from "../value-objects/index.js";

export abstract class Entity<T extends Entity<T, Key>, Key extends ValueObject<Key>> {
    private readonly _id: Key;

    public constructor(id: Key) {
        this._id = id;
    }

    public get id(): Key {
        return this._id.clone();
    }

    public equal(other?: T | null): boolean {
        if (!other) return false;
        if (other.constructor !== this.constructor) return false;
        return this._id.equal(other._id);
    }

    public abstract clone(): T;
}