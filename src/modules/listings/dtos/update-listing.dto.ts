import { PartialType } from '@nestjs/mapped-types';
import { CreateListingDto } from './create-listing.dto';
import { IsBoolean, IsOptional } from 'class-validator';


export class UpdateListingDto extends PartialType(CreateListingDto) {
    @IsOptional()
    @IsBoolean()
    approved: boolean
}