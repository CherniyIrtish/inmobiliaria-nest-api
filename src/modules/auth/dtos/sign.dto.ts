import { IsEmail, IsString } from "class-validator"

export class SignDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}