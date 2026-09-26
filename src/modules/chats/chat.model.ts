export class ChatModel {
    private readonly _id: number;
    private _name: string;
    private _description: string | null;

    public get id(): number {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get description(): string | null {
        return this._description;
    }

    public set name(value: string) {
        this._name = value;
    }

    public set description(value: string) {
        this._description = value;
    }

    public clearDescription(): void {
        this._description = null;
    }

    public static create(name: string, description: string | null = null): ChatModel {
        return new ChatModel(null!, name, description);
    }

    public static fromStorage(id: number, name: string, description: string | null = null): ChatModel {
        return new ChatModel(id, name, description);
    }

    private constructor(id: number, name: string, description: string | null) {
        this._id = id;
        this._name = name;
        this._description = description;
    }
}