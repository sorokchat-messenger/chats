import { Global, Module, type Provider } from "@nestjs/common";
import { CqrsModule as Cqrs } from '@nestjs/cqrs';
import { COMMAND_HANDLERS } from "../../application/index.js";

const PROVIDERS: Provider[] = [...COMMAND_HANDLERS];

@Global()
@Module({
    imports: [Cqrs],
    providers: PROVIDERS,
    exports: PROVIDERS
})
export class CqrsModule {
}