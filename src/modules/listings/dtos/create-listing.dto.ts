import { Type } from "class-transformer";
import { IsEmail, IsInt, IsNumber, IsString, MaxLength, Min } from "class-validator";


export class CreateListingDto {
    @IsString()
    @MaxLength(200)
    title: string;

    @IsString()
    description: string;

    @Type(() => Number)
    @IsInt()
    @Min(0)
    area: number

    @Type(() => Number)
    @IsInt()
    @Min(0)
    price: number

    @Type(() => Number)
    @IsInt()
    @Min(1)
    bedrooms: number
}