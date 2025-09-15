import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListingEntity } from './listing.entity';
import { GetListingsDto } from './dtos/get-listings.dto';
import { CreateListingDto } from './dtos/create-listing.dto';
import { UserEntity } from '../users/user.entity';
import { UpdateListingDto } from './dtos/update-listing.dto';


@Injectable()
export class ListingsService {

    constructor(@InjectRepository(ListingEntity) private _repo: Repository<ListingEntity>) { }


    getListings({ approved, bedrooms, }: GetListingsDto) {
        const qb = this._repo.createQueryBuilder('l');

        if (approved !== undefined) {
            qb.andWhere('l.approved = :approved', { approved });
        }

        if (bedrooms !== undefined) {
            qb.andWhere('l.bedrooms = :bedrooms', { bedrooms });
        }

        return qb.getMany();
    }

    createListing(listingDto: CreateListingDto, user: UserEntity) {
        const listing = this._repo.create(listingDto);

        listing.user = user;

        return this._repo.save(listing);
    }

    async updateListing(id: string, listingDto: UpdateListingDto) {
        let listing = await this._repo.findOneBy({ id: +id });

        if (!listing) throw new NotFoundException('Listing not found');

        listing = { ...listing, ...listingDto }

        return this._repo.save(listing);
    }

    async removeListing(id: number) {
        const listing = await this._repo.findOneBy({ id });

        if (!listing) throw new NotFoundException('Listing not found');

        return this._repo.remove(listing);
    }
}
