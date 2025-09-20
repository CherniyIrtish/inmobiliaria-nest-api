import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    mixin,
    Type,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../modules/users/users.service';
import { Request } from 'express';
import { UserEntity } from '../../modules/users/user.entity';

declare module 'express-serve-static-core' {
    interface Request {
        currentUser?: UserEntity;
    }
}


export function PreAuthGuard(allowedStages: string[] | string): Type<CanActivate> {
    const stages = Array.isArray(allowedStages) ? allowedStages : [allowedStages];

    @Injectable()
    class PreAuthGuardMixin implements CanActivate {
        constructor(
            private readonly jwt: JwtService,
            private readonly cfg: ConfigService,
            private readonly users: UsersService,
        ) { }

        async canActivate(ctx: ExecutionContext): Promise<boolean> {
            const req = ctx.switchToHttp().getRequest<Request>();
            const auth = (req.headers.authorization || '') as string;
            const [scheme, token] = auth.split(' ');

            if (scheme !== 'Bearer' || !token) {
                throw new UnauthorizedException('Invalid Authorization header');
            }

            const payload = await this.jwt.verifyAsync<any>(token, {
                secret: this.cfg.getOrThrow<string>('JWT_SECRET'),
                algorithms: ['HS256'],
            });

            const user = await this.users.findOne(payload.sub);

            if (!user) throw new UnauthorizedException('User not found');

            if (!payload.stage || !stages.includes(payload.stage)) {
                throw new UnauthorizedException('Invalid token stage');
            }

            if (payload.tver !== user.tokenVersion) {
                throw new UnauthorizedException('Token revoked');
            }

            req.currentUser = user;

            return true;
        }
    }

    return mixin(PreAuthGuardMixin);
}