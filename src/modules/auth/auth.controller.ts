import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignDto } from './dtos/sign.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { AuthResponseDto } from './dtos/auth-response.dto';


@Controller()
export class AuthController {
    constructor(private readonly _authService: AuthService) { }

    @Post('/signup')
    @Serialize(UserDto)
    async signUp(@Body() body: SignDto) {
        const user = await this._authService.signup(body.email, body.password);

        return user;
    }

    @Post('/signin')
    @Serialize(AuthResponseDto)
    async signIn(@Body() body: SignDto) {
        const { user, accessToken } = await this._authService.signin(body.email, body.password);

        return { user, accessToken };
    }

    @Post('/signout')
    async signOut() {
        return { ok: true };
    }
}
