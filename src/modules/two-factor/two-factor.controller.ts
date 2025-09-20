import { Body, Controller, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TwoFactorService } from './two-factor.service';
import { UserEntity } from '../users/user.entity';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PreAuthGuard } from '../../common/guards/preauth.guard';
import { UsersService } from '../users/users.service';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags('two-factor')
@ApiBearerAuth('access-token')
@Controller()
export class TwoFactorController {

    constructor(
        private readonly _2faService: TwoFactorService,
        private readonly _jwtService: JwtService,
        private readonly _usersService: UsersService) { }


    @UseGuards(PreAuthGuard('mfa-enroll'))
    @Post('2fa/setup')
    @ApiOperation({
        summary: 'Start MFA enrollment',
        description: 'Requires a preauth token with stage=mfa-enroll. Returns the otpauth URI and a QR image (data URL) to scan in an authenticator app.',
    })
    @ApiOkResponse({
        description: 'Enrollment payload returned',
        schema: {
            type: 'object',
            properties: {
                otpauth: { type: 'string', example: 'otpauth://totp/Inmobiliaria:user@example.com?secret=BASE32&issuer=Inmobiliaria' },
                qrDataUrl: { type: 'string', example: 'data:image/png;base64,iVBORw0KGgoAAA...' },
            },
        },
    })
    async setup(@CurrentUser() user: UserEntity) {
        return this._2faService.setup(user.id);
    }

    @UseGuards(PreAuthGuard(['mfa-enroll', 'mfa-auth']))
    @Post('2fa/verify')
    @ApiOperation({
        summary: 'Verify MFA code',
        description:
            'Requires a preauth token (stage=mfa-enroll or stage=mfa-auth). On success, returns a full access token for authenticated requests.',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: { code: { type: 'string', example: '123456' } },
            required: ['code'],
        },
    })
    @ApiOkResponse({
        description: 'MFA verified, access token issued',
        schema: {
            type: 'object',
            properties: {
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 12 },
                        email: { type: 'string', example: 'user@example.com' },
                        admin: { type: 'boolean', example: false },
                    },
                },
                accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            },
        },
    })
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
