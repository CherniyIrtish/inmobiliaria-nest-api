import { Transform, Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, Min } from "class-validator";


export class GetListingsDto {
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    approved: boolean;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    bedrooms: number;
}