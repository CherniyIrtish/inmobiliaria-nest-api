import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserEntity } from './user.entity';
import { UserDto } from '../auth/dtos/user.dto';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { AuthGuard } from '../../common/guards/auth.guard';
import { UsersService } from './users.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';


@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller()
@Serialize(UserDto)
export class UsersController {
    constructor(
        private _usersService: UsersService
    ) { }

    @Get('/me')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Get current user', description: 'Returns the authenticated user profile extracted from the access token.' })
    @ApiOkResponse({ description: 'Current user', type: UserDto })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
    me(@CurrentUser() user: UserEntity) {
        return user;
    }

    @Get('/users')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'List users', description: 'Returns list of users' })
    @ApiOkResponse({ description: 'Users list', type: UserDto, isArray: true })
    async getUsers(@CurrentUser() currentUser: UserEntity) {
        return this._usersService.getUsers(currentUser);
    }

    @Patch('/users/:id/2fa/require')
    @UseGuards(AuthGuard, AdminGuard)
    @ApiOperation({
        summary: 'Require 2FA for a user (admin only)',
        description:
            'Enables or disables the “2FA required”',
    })
    @ApiParam({ name: 'id', type: Number, example: 42, description: 'User ID' })
    @ApiBody({ schema: { type: 'object', properties: { totpRequired: { type: 'boolean', example: true } }, required: ['totpRequired'] } })
    @ApiOkResponse({ description: 'Flag updated', schema: { example: { ok: true } } })
    async require2fa(@Param('id') id: string, @Body() body: { totpRequired: boolean }) {
        await this._usersService.require2fa(+id, !!body.totpRequired);

        return { ok: true };
    }

    @Delete('/users/:id')
    @UseGuards(AuthGuard, AdminGuard)
    @ApiOperation({ summary: 'Delete user (admin only)', description: 'Deletes a user by ID' })
    @ApiParam({ name: 'id', type: Number, example: 42, description: 'User ID' })
    @ApiOkResponse({ description: 'Deleted', schema: { example: { ok: true } } })
    removeListing(@Param('id') id: string) {
        return this._usersService.deleteUser(parseInt(id));
    }
}
