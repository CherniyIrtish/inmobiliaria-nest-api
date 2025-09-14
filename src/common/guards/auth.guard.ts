// import { CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";


// export class AuthGuard implements CanActivate {
//     canActivate(context: ExecutionContext): boolean {
//         const req = context.switchToHttp().getRequest();
//         const isAuthed = !!req.session?.userId;

//         if (!isAuthed) {
//             throw new ForbiddenException('Not authenticated');
//         }

//         return true;
//     }
// }

import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../modules/users/users.service';


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly _jwt: JwtService,
        private readonly _config: ConfigService,
        private readonly _users: UsersService,
    ) { }

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req = ctx.switchToHttp().getRequest();

        const auth = req.headers['authorization'] as string | undefined;

        if (!auth) throw new UnauthorizedException('Missing Authorization header');

        const [type, token] = auth.split(' ');

        if (type !== 'Bearer' || !token)
            throw new UnauthorizedException('Invalid Authorization header');

        try {
            const payload = await this._jwt.verifyAsync(token, {
                secret: this._config.getOrThrow<string>('JWT_SECRET'),
            });

            const user = await this._users.findOne(payload.sub);

            if (!user) throw new UnauthorizedException('User not found');

            req.currentUser = user;

            return true;
        } catch (e) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}