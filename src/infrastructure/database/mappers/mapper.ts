export interface Mapper<Model, Persistence> {
    toPersistence(model: Model): Persistence;
    toModel(persistence: Persistence): Model;
}