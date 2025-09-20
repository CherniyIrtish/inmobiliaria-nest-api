import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignDto } from './dtos/sign.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from '../../common/interceptors/serialize.interceptor';

// Options for /signin response
class SigninOkResponse {
    user: UserDto;
    accessToken: string;
}
class SigninMfaEnrollResponse {
    mfaEnrollRequired: true;
    preauthToken: string;
}
class SigninMfaRequiredResponse {
    mfaRequired: true;
    preauthToken: string;
}

@ApiTags('auth')
@Controller()
export class AuthController {
    constructor(private readonly _authService: AuthService) { }

    @Post('/signup')
    @ApiOperation({ summary: 'Create a new account', description: 'Registers a user by email and password.' })
    @ApiBody({
        type: SignDto,
        examples: { default: { summary: 'Valid payload', value: { email: 'user@example.com', password: 'Passw0rd' } } },
    })
    @ApiCreatedResponse({
        description: 'User created',
        type: UserDto,
        examples: { default: { summary: 'Created user', value: { id: 123, email: 'user@example.com', admin: false } } },
    })

    @Serialize(UserDto)
    async signUp(@Body() body: SignDto) {
        const user = await this._authService.signup(body.email, body.password);

        return user;
    }

    @Post('/signin')
    @ApiOperation({
        summary: 'User sign in',
        description: 'Returns accessToken immediately, or a short-lived preauthToken for MFA enrollment/verification.',
    })
    @ApiBody({
        type: SignDto,
        examples: {
            default: { summary: 'Valid credentials', value: { email: 'user@example.com', password: 'Passw0rd' } },
        },
    })
    @ApiOkResponse({
        description: 'One of three outcomes',
        schema: {
            oneOf: [
                { $ref: getSchemaPath(SigninOkResponse) },
                { $ref: getSchemaPath(SigninMfaEnrollResponse) },
                { $ref: getSchemaPath(SigninMfaRequiredResponse) },
            ],
            examples: {
                access: {
                    summary: 'Access token issued (no MFA)',
                    value: {
                        user: { id: 1, email: 'user@example.com', admin: false },
                        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    },
                },
                mfaEnroll: {
                    summary: 'MFA enrollment required',
                    value: { mfaEnrollRequired: true, preauthToken: 'eyJhbGciOiJI...' },
                },
                mfaRequired: {
                    summary: 'MFA code required',
                    value: { mfaRequired: true, preauthToken: 'eyJhbGciOiJI...' },
                },
            },
        },
    })
    async signIn(@Body() body: SignDto) {
        return this._authService.signin(body.email, body.password);
    }

    @Post('/signout')
    @ApiOperation({ summary: 'Sign out', description: 'Client-side only: just discard the access token.' })
    @ApiOkResponse({ schema: { example: { ok: true } } })
    async signOut() {
        return { ok: true };
    }
}
