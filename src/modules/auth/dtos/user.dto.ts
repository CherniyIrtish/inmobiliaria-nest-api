import { Expose } from "class-transformer";
import { ListingEntity } from "src/modules/listings/listing.entity";


export class UserDto {
    @Expose()
    id: number;

    @Expose()
    email: string;

    @Expose()
    admin: boolean;

    @Expose()
    listings: ListingEntity[];
}