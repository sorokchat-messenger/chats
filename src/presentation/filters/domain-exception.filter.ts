import { Catch, RpcExceptionFilter } from "@nestjs/common";
import { ChatNotFoundException, DomainException, LastAdminException, MemberAlreadyExistsException, MemberNotAdminException, MemberNotFoundException, NotSelfException } from "../../domain/index.js";
import { Observable, throwError } from "rxjs";
import { GrpcStatus } from "@sorokchat-messenger/microservices";
import { RpcException } from '@nestjs/microservices';

@Catch(DomainException)
export class DomainExceptionFilter implements RpcExceptionFilter {
    public catch(exception: DomainException): Observable<unknown> {
        let code: GrpcStatus = GrpcStatus.INTERNAL;
        if (exception instanceof MemberNotFoundException || exception instanceof ChatNotFoundException) {
            code = GrpcStatus.NOT_FOUND;
        } else if (exception instanceof MemberNotAdminException) {
            code = GrpcStatus.PERMISSION_DENIED;
        } else if (exception instanceof MemberAlreadyExistsException) {
            code = GrpcStatus.ALREADY_EXISTS;
        } else if (exception instanceof NotSelfException) {
            code = GrpcStatus.INVALID_ARGUMENT;
        } else if (exception instanceof LastAdminException) {
            code = GrpcStatus.FAILED_PRECONDITION;
        }
        return throwError(() => new RpcException({ code, message: exception.message }));
    }
}