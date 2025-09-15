import { PartialType } from '@nestjs/mapped-types';
import { CreateListingDto } from './create-listing.dto';
import { IsBoolean } from 'class-validator';


export class UpdateListingDto extends PartialType(CreateListingDto) {
    @IsBoolean()
    approved: boolean
}