import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserEntity } from './user.entity';
import { UserDto } from '../auth/dtos/user.dto';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { AuthGuard } from '../../common/guards/auth.guard';
import { UsersService } from './users.service';


@Controller()
@Serialize(UserDto)
export class UsersController {
    constructor(
        private _userService: UsersService
    ) { }

    @Get('/me')
    @UseGuards(AuthGuard)
    me(@CurrentUser() user: UserEntity) {
        return user;
    }

    @Get('/users')
    @UseGuards(AuthGuard)
    async getUsers(@CurrentUser() currentUser: UserEntity) {
        return this._userService.getUsers(currentUser);
    }

    @Delete('/users/:id')
    removeListing(@Param('id') id: string) {
        return this._userService.deleteUser(parseInt(id));
    }
}
