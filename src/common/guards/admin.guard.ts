import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserEntity } from "src/modules/users/user.entity";

interface Request {
    currentUser?: UserEntity;
}


@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(ctx: ExecutionContext): boolean {
        const req = ctx.switchToHttp().getRequest<Request>();
        const user = req.currentUser;

        if (!user) {
            throw new UnauthorizedException('Not authenticated');
        }

        if (!user.admin) {
            throw new ForbiddenException('Admin only');
        }

        return true;
    }
}