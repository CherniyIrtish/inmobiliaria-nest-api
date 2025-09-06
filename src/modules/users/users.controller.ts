import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UserEntity } from './user.entity';
import { UserDto } from '../auth/dtos/user.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';


@Controller()
@Serialize(UserDto)
export class UsersController {

    @Get('/me')
    @UseGuards(AuthGuard)
    me(@CurrentUser() user: UserEntity) {
        return user;
    }
}
