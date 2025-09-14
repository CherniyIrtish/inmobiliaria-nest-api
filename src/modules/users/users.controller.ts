import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserEntity } from './user.entity';
import { UserDto } from '../auth/dtos/user.dto';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { AuthGuard } from 'src/common/guards/auth.guard';


@Controller()
@Serialize(UserDto)
export class UsersController {

    @Get('/me')
    @UseGuards(AuthGuard)
    me(@CurrentUser() user: UserEntity) {
        return user;
    }
}
