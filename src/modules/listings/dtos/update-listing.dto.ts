import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateListingDto } from './create-listing.dto';
import { IsBoolean, IsOptional } from 'class-validator';


export class UpdateListingDto extends PartialType(CreateListingDto) {
    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    approved: boolean
}