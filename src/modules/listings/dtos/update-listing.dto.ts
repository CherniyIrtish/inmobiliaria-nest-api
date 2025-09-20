import { PartialType } from '@nestjs/mapped-types';
import { CreateListingDto } from './create-listing.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';


export class UpdateListingDto extends PartialType(CreateListingDto) {
    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    approved: boolean
}