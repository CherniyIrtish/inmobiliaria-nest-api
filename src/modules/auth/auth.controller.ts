import { Body, Controller, Post, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignDto } from './dtos/sign.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from '../../common/interceptors/serialize.interceptor';


@Controller()
@Serialize(UserDto)
export class AuthController {
    constructor(private readonly _authService: AuthService) { }

    @Post('/signup')
    async signUp(@Body() body: SignDto, @Session() session: any) {
        const user = await this._authService.signup(body.email, body.password);

        return user;
    }

    @Post('/signin',)
    async signIn(@Body() body: SignDto, @Session() session: any) {
        const user = await this._authService.signin(body.email, body.password);

        session.userId = user.id;

        return user;
    }

    @Post('/signout')
    async signOut(@Session() session: any) {
        session.userId = null;
    }
}
