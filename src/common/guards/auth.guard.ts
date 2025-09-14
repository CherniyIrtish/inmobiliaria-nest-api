import { CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";


export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        const isAuthed = !!req.session?.userId;
        if (!isAuthed) {
            throw new ForbiddenException('Not authenticated');
        }

        return true;
    }
}