import { Expose, Type } from "class-transformer";
import { ListingDto } from "src/modules/listings/dtos/listing-dto.dto";


export class UserDto {
    @Expose()
    id: number;

    @Expose()
    email: string;

    @Expose()
    admin: boolean;

    @Expose()
    totpEnabled: boolean;

    @Expose()
    totpRequired: boolean;


    @Expose()
    @Type(() => ListingDto)
    listings: ListingDto[];
}