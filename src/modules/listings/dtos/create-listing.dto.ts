import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsString, MaxLength, Min } from "class-validator";


export class CreateListingDto {
    @ApiProperty({ example: 'Cozy Studio in City Center', maxLength: 200 })
    @IsString()
    @MaxLength(200)
    title: string;

    @ApiProperty({ example: 'Sunny, fully furnished, close to metro' })
    @IsString()
    description: string;

    @ApiProperty({ example: 42, minimum: 0, description: 'Area in square meters' })
    @Type(() => Number)
    @IsInt()
    @Min(0)
    area: number

    @ApiProperty({ example: 1200, minimum: 0, description: 'Monthly price' })
    @Type(() => Number)
    @IsInt()
    @Min(0)
    price: number

    @ApiProperty({ example: 2, minimum: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    bedrooms: number
}