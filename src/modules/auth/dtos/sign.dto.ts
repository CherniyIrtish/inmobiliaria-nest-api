import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator"


export class SignDto {
    @ApiProperty({ example: 'user@example.com', description: 'User email' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'Passw0rd', description: 'User password (min 6 chars)' })
    @IsString()
    password: string;
}