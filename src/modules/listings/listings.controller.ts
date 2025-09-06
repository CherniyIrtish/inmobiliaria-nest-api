import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { GetListingsDto } from './dtos/get-listings.dto';
import { CreateListingDto } from './dtos/create-listing.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserEntity } from '../users/user.entity';
import { UpdateListingDto } from './dtos/update-listing.dto';


@Controller('listings')
export class ListingsController {

    constructor(private _listingsService: ListingsService) { }

    @Get()
    @UseGuards(AuthGuard)
    getListings(@Query() query: GetListingsDto) {
        return this._listingsService.getListings(query);
    }

    @Post()
    @UseGuards(AuthGuard)
    async createListing(@Body() body: CreateListingDto, @CurrentUser() user: UserEntity) {
        return this._listingsService.createListing(body, user);
    }

    @Patch('/:id')
    @UseGuards(AuthGuard)
    updateListing(@Param('id') id: string, @Body() body: UpdateListingDto) { }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this._listingsService.removeListing(parseInt(id));
    }
}

// constructor(private _reportService: ReportsService) { }

// @Get()
// getEstimate(@Query() query: GetEstimateDto) {
//     return this._reportService.createEstimate(query);
// }

// @Post()
// @UseGuards(AuthGuard)
// @Serialize(ReportDto)
// async createReport(@Body() body: CreateReportDto, @CurrentUser() user: UserEntity) {
//     return this._reportService.create(body, user);
// }

// @Patch('/:id')
// @UseGuards(AuthGuard)
// approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
//     return this._reportService.changeApproval(id, body.approved);
// }