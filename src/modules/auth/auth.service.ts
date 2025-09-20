import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { promisify } from 'util';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { UsersService } from '../users/users.service';

const scrypt = promisify(_scrypt);

type SigninResult =
    | { user: any; accessToken: string }                     // without 2FA
    | { mfaEnrollRequired: true; preauthToken: string }      // needs to setup 2FA
    | { mfaRequired: true; preauthToken: string };           // 2FA already setup — needs a code



@Injectable()
export class AuthService {
    constructor(
        private readonly _jwtService: JwtService,
        private readonly _userService: UsersService,
    ) { }

    async signup(email: string, password: string) {
        const users = await this._userService.find(email);

        if (users.length) throw new BadRequestException('Email in use');

        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(password, salt, 32) as Buffer).toString('hex');
        const user = await this._userService.create(email, `${salt}.${hash}`);

        return user;
    }

    async signin(email: string, password: string): Promise<SigninResult> {
        const [user] = await this._userService.find(email);

        if (!user) throw new NotFoundException('User not found');

        const [salt, storedHash] = user.password.split('.');
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('Bad password');
        }

        if (user.totpRequired && !user.totpEnabled) {
            const preauthToken = this._jwtService.sign(
                { sub: user.id, email: user.email, tver: user.tokenVersion, stage: 'mfa-enroll' },
                { expiresIn: '5m' },
            );

            return { mfaEnrollRequired: true, preauthToken };
        }

        if (user.totpEnabled) {
            const preauthToken = this._jwtService.sign(
                { sub: user.id, email: user.email, tver: user.tokenVersion, stage: 'mfa-auth' },
                { expiresIn: '5m' },
            );

            return { mfaRequired: true, preauthToken };
        }

        const accessToken = this._jwtService.sign({
            sub: user.id,
            email: user.email,
            tver: user.tokenVersion,
            stage: 'access',
        });

        return { user, accessToken };
    }
}