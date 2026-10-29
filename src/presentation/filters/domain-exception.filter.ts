import {
    Catch,
    RpcExceptionFilter
} from "@nestjs/common";
import {
    ChatNotFoundException,
    DomainException,
    LastAdminException,
    MemberAlreadyExistsException,
    MemberNotAdminException,
    MemberNotFoundException,
    NotIdException,
    NotSelfException
} from "../../domain/index.js";
import {
    Observable,
    throwError
} from "rxjs";
import { GrpcStatus } from "@sorokchat-messenger/microservices";
import { RpcException } from '@nestjs/microservices';
import { ChatsCodes, UNKNOWN } from "@sorokchat-messenger/contracts";

@Catch(DomainException)
export class DomainExceptionFilter implements RpcExceptionFilter {
    public catch(exception: DomainException): Observable<unknown> {
        let code: GrpcStatus = GrpcStatus.INTERNAL;
        let message: string = UNKNOWN;
        if (exception instanceof MemberNotFoundException) {
            code = GrpcStatus.NOT_FOUND;
            message = ChatsCodes.PARTICIPANT.NOT_FOUND;
        }
        if (exception instanceof ChatNotFoundException) {
            code = GrpcStatus.NOT_FOUND;
            message = ChatsCodes.NOT_FOUND;
        }
        if (exception instanceof MemberNotAdminException) {
            code = GrpcStatus.PERMISSION_DENIED;
            message = ChatsCodes.PARTICIPANT.NOT_ADMIN;
        }
        if (exception instanceof MemberAlreadyExistsException) {
            code = GrpcStatus.ALREADY_EXISTS;
            message = ChatsCodes.PARTICIPANT.EXISTS;
        }
        if (exception instanceof NotSelfException) {
            code = GrpcStatus.INVALID_ARGUMENT;
            message = ChatsCodes.PARTICIPANT.NOT_SELF;
        }
        if (exception instanceof LastAdminException) {
            code = GrpcStatus.FAILED_PRECONDITION;
            message = ChatsCodes.PARTICIPANT.LAST_ADMIN;
        }
        if (exception instanceof NotIdException) {
            code = GrpcStatus.INVALID_ARGUMENT;
            message = ChatsCodes.ID.INCORRECT;
        }
        return throwError(() => new RpcException({ code, message }));
    }
}