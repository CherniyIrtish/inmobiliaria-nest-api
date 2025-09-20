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
        private readonly _jwtService: JwtService,
        private readonly _configService: ConfigService,
        private readonly _usersService: UsersService,
    ) { }

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req = ctx.switchToHttp().getRequest();

        const auth = req.headers['authorization'] as string | undefined;

        if (!auth) throw new UnauthorizedException('Missing Authorization header');

        const [type, token] = auth.split(' ');

        if (type !== 'Bearer' || !token) {
            throw new UnauthorizedException('Invalid Authorization header');
        }

        try {
            const payload = await this._jwtService.verifyAsync<any>(token, {
                secret: this._configService.getOrThrow<string>('JWT_SECRET'),
            });

            if (payload.stage && payload.stage !== 'access') {
                throw new UnauthorizedException('Preauth token not allowed');
            }

            const user = await this._usersService.findOne(payload.sub);

            if (!user) throw new UnauthorizedException('User not found');

            if (payload.tver !== undefined && payload.tver !== user.tokenVersion) {
                throw new UnauthorizedException('Token revoked');
            }

            req.currentUser = user;
            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}