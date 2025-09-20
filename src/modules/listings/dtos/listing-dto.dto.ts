import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';


export class ListingDto {
    @ApiProperty({ example: 101 })
    @Expose() id: number;

    @ApiProperty({ example: 'Cozy Studio in City Center' })
    @Expose() title: string;

    @ApiProperty({ example: 'Sunny, fully furnished, close to metro' })
    @Expose() description: string;

    @ApiProperty({ example: 42 })
    @Expose() area: number;

    @ApiProperty({ example: 1200 })
    @Expose() price: number;

    @ApiProperty({ example: 2 })
    @Expose() bedrooms: number;

    @ApiProperty({ example: false })
    @Expose() approved: boolean;

    @ApiProperty({ format: 'date-time', example: '2025-09-19T21:34:23.130Z' })
    @Expose() createdAt: Date;

    @ApiProperty({ format: 'date-time', example: '2025-09-20T10:12:45.001Z' })
    @Expose() updatedAt: Date;
}