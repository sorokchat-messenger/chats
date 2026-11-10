import { Global, Module, type Provider } from "@nestjs/common";
import { CqrsModule as Cqrs } from '@nestjs/cqrs';
import { COMMAND_HANDLERS, QUERY_HANDLERS } from "../../application/index.js";
import { CqrsBus } from "./cqrs.bus.js";

const PROVIDERS: Provider[] = [...COMMAND_HANDLERS, ...QUERY_HANDLERS, CqrsBus];

@Global()
@Module({
    imports: [Cqrs],
    providers: PROVIDERS,
    exports: PROVIDERS
})
export class CqrsModule {
}