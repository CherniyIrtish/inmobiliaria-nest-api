import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import cookieSession from 'cookie-session';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppDataSource } from './database/data-source';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ListingsModule } from './modules/listings/listings.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: `.env.${process.env.NODE_ENV}` }),
    TypeOrmModule.forRoot(AppDataSource.options),
    AuthModule,
    ListingsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private _configService: ConfigService) { }

  configure(consumer: MiddlewareConsumer) {
    const isProd = process.env.NODE_ENV === 'production';

    consumer.apply(
      cookieSession({
        keys: [this._configService.getOrThrow('COOKIE_KEY') as string],
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: isProd,
        sameSite: 'none',
      })
    )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
