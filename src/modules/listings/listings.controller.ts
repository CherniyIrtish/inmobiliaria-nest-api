import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { GetListingsDto } from './dtos/get-listings.dto';
import { CreateListingDto } from './dtos/create-listing.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserEntity } from '../users/user.entity';
import { UpdateListingDto } from './dtos/update-listing.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ListingDto } from './dtos/listing-dto.dto';


@ApiTags('listings')
@ApiBearerAuth('access-token')
@Controller('listings')
export class ListingsController {

    constructor(private _listingsService: ListingsService) { }

    @Get()
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Get listings',
        description: 'Admins see all ads. Regular users see only their own. Filters are optional',
    })
    @ApiQuery({ name: 'approved', required: false, type: Boolean, example: true })
    @ApiQuery({ name: 'bedrooms', required: false, type: Number, example: 2 })
    @ApiOkResponse({ type: GetListingsDto, isArray: true })
    getListings(@Query() query: GetListingsDto, @CurrentUser() currentUser: UserEntity) {
        const userId = currentUser.admin ? undefined : currentUser.id;

        return this._listingsService.getListings(query, userId);
    }

    @Post()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Create listing' })
    @ApiBody({
        type: CreateListingDto,
        examples: {
            default: {
                summary: 'Valid payload',
                value: { title: 'Cozy Apartment', description: 'Sunny 2BR near park', area: 68, price: 1200, bedrooms: 2 },
            },
        },
    })
    @ApiCreatedResponse({ description: 'Created', type: CreateListingDto })
    async createListing(@Body() body: CreateListingDto, @CurrentUser() user: UserEntity) {
        return this._listingsService.createListing(body, user);
    }

    @Patch('/:id')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Update listing' })
    @ApiParam({ name: 'id', type: String, example: '42' })
    @ApiBody({
        type: UpdateListingDto,
        examples: {
            approve: { summary: 'Approve', value: { approved: true } },
            price: { summary: 'Change price', value: { price: 1350 } },
        },
    })
    @ApiOkResponse({ description: 'Updated', type: ListingDto })
    updateListing(@Param('id') id: string, @Body() body: UpdateListingDto) {
        return this._listingsService.updateListing(id, body);
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'Delete listing' })
    @ApiParam({ name: 'id', type: String, example: '42' })
    @ApiOkResponse({ description: 'Deleted', type: ListingDto })
    removeListing(@Param('id') id: string) {
        return this._listingsService.removeListing(parseInt(id));
    }
}