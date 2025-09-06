import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';
import { ListingEntity } from './listing.entity';


@Module({
  imports: [TypeOrmModule.forFeature([ListingEntity])],
  controllers: [ListingsController],
  providers: [ListingsService],
  exports: []
})
export class ListingsModule { }
