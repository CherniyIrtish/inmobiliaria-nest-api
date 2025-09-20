import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { ListingDto } from "src/modules/listings/dtos/listing-dto.dto";


export class UserDto {
    @ApiProperty({ example: 12 })
    @Expose()
    id: number;

    @ApiProperty({ example: 'user@example.com' })
    @Expose()
    email: string;

    @ApiProperty({ example: false })
    @Expose()
    admin: boolean;

    @ApiProperty({ example: true })
    @Expose()
    totpEnabled: boolean;

    @ApiProperty({ example: false })
    @Expose()
    totpRequired: boolean;

    @ApiProperty({ type: () => [ListingDto], required: false })
    @Expose()
    @Type(() => ListingDto)
    listings: ListingDto[];
}