import { Body, Controller, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TwoFactorService } from './two-factor.service';
import { UserEntity } from '../users/user.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PreAuthGuard } from 'src/common/guards/preauth.guard';
import { UsersService } from '../users/users.service';


@Controller()
export class TwoFactorController {

    constructor(
        private readonly _2faService: TwoFactorService,
        private readonly _jwtService: JwtService,
        private readonly _usersService: UsersService) { }

    @UseGuards(PreAuthGuard('mfa-enroll'))
    @Post('2fa/setup')
    async setup(@CurrentUser() user: UserEntity) {
        return this._2faService.setup(user.id);
    }

    @UseGuards(PreAuthGuard(['mfa-enroll', 'mfa-auth']))
    @Post('2fa/verify')
    async verify(@CurrentUser() user: UserEntity, @Body('code') code: string) {
        await this._2faService.verify(user.id, code);

        const fresh = await this._usersService.findOne(user.id);

        if (!fresh) throw new UnauthorizedException('User not found');

        const payload = {
            sub: fresh.id,
            email: fresh.email,
            tver: fresh.tokenVersion,
            stage: 'access',
        };
        const accessToken = this._jwtService.sign(payload);

        return { user: fresh, accessToken };
    }
}
