import { Id } from "../value-objects/index.js";

export abstract class Entity<T extends Entity<T>> {
    private readonly _id: Id;

    public constructor(id: Id) {
        this._id = id;
    }

    public get id(): Id {
        return this._id.clone();
    }

    public equal(other?: T | null): boolean {
        if (!other) return false;
        if (other.constructor !== this.constructor) return false;
        return this._id.equal(other._id);
    }

    public abstract clone(): T;
}