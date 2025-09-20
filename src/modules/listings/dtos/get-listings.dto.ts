import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, Min } from "class-validator";


export class GetListingsDto {
    @ApiPropertyOptional({ description: 'Filter by approval state', example: true })
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    approved: boolean;

    @ApiPropertyOptional({ description: 'Filter by exact bedrooms count', example: 2, minimum: 0 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    bedrooms: number;
}