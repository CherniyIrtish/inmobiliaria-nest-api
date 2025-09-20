import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserEntity } from './user.entity';
import { UserDto } from '../auth/dtos/user.dto';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { AuthGuard } from '../../common/guards/auth.guard';
import { UsersService } from './users.service';
import { AdminGuard } from 'src/common/guards/admin.guard';


@Controller()
@Serialize(UserDto)
export class UsersController {
    constructor(
        private _usersService: UsersService
    ) { }

    @Get('/me')
    @UseGuards(AuthGuard)
    me(@CurrentUser() user: UserEntity) {
        return user;
    }

    @Get('/users')
    @UseGuards(AuthGuard)
    async getUsers(@CurrentUser() currentUser: UserEntity) {
        return this._usersService.getUsers(currentUser);
    }

    @Patch('/users/:id/2fa/require')
    @UseGuards(AuthGuard, AdminGuard)
    async require2fa(@Param('id') id: string, @Body() body: { totpRequired: boolean }) {
        await this._usersService.require2fa(+id, !!body.totpRequired);

        return { ok: true };
    }

    @Delete('/users/:id')
    removeListing(@Param('id') id: string) {
        return this._usersService.deleteUser(parseInt(id));
    }
}
