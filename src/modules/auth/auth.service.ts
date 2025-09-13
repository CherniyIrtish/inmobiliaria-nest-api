import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { promisify } from "util";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

const scrypt = promisify(_scrypt)


@Injectable()
export class AuthService {

    constructor(private readonly _jwtService: JwtService,
        private _userService: UsersService) { }

    async signup(email: string, password: string) {
        const users = await this._userService.find(email);

        if (users.length) throw new BadRequestException('Email in use');

        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(password, salt, 32) as Buffer);
        const result = `${salt}.${hash.toString('hex')}`
        const user = await this._userService.create(email, result);

        return user
    }

    async signin(email: string, password: string) {
        const [user] = await this._userService.find(email);
        if (!user) throw new NotFoundException('User not found');

        const [salt, storedHash] = user.password.split('.');
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('Bad password');
        }

        const payload = { sub: user.id, email: user.email };
        const accessToken = this._jwtService.sign(payload);

        return { user, accessToken };
    }
}
