export abstract class ValueObject<T extends ValueObject<T>> {
    public equal(other?: ValueObject<T> | null): boolean {
        if (!other) return false;
        if (other.constructor !== this.constructor) return false;
        const firstProperies = this.getProperies();
        const secondProperies = other.getProperies();
        if (firstProperies.length !== secondProperies.length) return false;
        return firstProperies.every((value, index) => this.isEqualValues(value, secondProperies[index]));
    }

    private getProperies(): unknown[] {
        const prototype = Object.getPrototypeOf(this);
        const propertieNames = [
            ...Object.getOwnPropertyNames(this),
            ...Object.getOwnPropertyNames(prototype)
        ];
        const selfRecord = this as unknown as Record<string, unknown>;
        const keys = Array.from(new Set(propertieNames))
            .filter(key => {
                if (key === 'constructor') return false;
                if (key.startsWith("_")) return false;
                const descriptor = Object.getOwnPropertyDescriptor(this, key) || Object.getOwnPropertyDescriptor(prototype, key);
                const isFunction = typeof selfRecord[key] === 'function';
                const isGetter = descriptor && typeof descriptor.get === 'function';
                return !isFunction || isGetter;
            });
        return keys.map(key => selfRecord[key]);
    }

    private isEqualValues(first: unknown, second: unknown): boolean {
        if (first === second) return true;
        if (Array.isArray(first) && Array.isArray(second)) {
            if (first.length !== second.length) return false;
            return first.every((item, index) => this.isEqualValues(item, second[index]));
        }
        if (this.isValueObject(first) && this.isValueObject(second)) {
            return first.equal(second);
        }
        return false;
    }

    private isValueObject(value: unknown): value is ValueObject<T> {
        return value !== null && value !== undefined && typeof value === 'object' && "equal" in value;
    }

    public abstract clone(): T;
}