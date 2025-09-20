import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppDataSource } from './database/data-source';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ListingsModule } from './modules/listings/listings.module';
import { twoFactorModule } from './modules/two-factor/twoFactor.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: `.env.${process.env.NODE_ENV}` }),
    TypeOrmModule.forRoot(AppDataSource.options),
    AuthModule,
    twoFactorModule,
    ListingsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
