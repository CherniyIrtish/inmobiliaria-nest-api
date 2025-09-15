import { Expose } from 'class-transformer';

export class ListingDto {
    @Expose() id: number;
    @Expose() title: string;
    @Expose() description: string;
    @Expose() area: number;
    @Expose() price: number;
    @Expose() bedrooms: number;
    @Expose() approved: boolean;
    @Expose() createdAt: Date;
    @Expose() updatedAt: Date;
}