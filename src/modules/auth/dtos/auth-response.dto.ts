import { Expose, Type } from 'class-transformer';
import { UserDto } from './user.dto';

export class AuthResponseDto {
    @Type(() => UserDto)
    @Expose()
    user: UserDto;

    @Expose()
    accessToken: string;
}