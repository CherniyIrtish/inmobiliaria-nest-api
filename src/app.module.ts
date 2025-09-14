import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import cookieSession from 'cookie-session';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppDataSource } from './database/data-source';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ListingsModule } from './modules/listings/listings.module';
import session from 'express-session';


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

    // consumer
    //   .apply(
    //     cookieSession({
    //       name: 'session',
    //       keys: [this._configService.getOrThrow('COOKIE_KEY') as string],
    //       maxAge: 1000 * 60 * 60 * 24 * 7,
    //       httpOnly: true,
    //       secure: isProd,
    //       sameSite: isProd ? 'none' : 'lax',
    //     }),
    //   )
    //   .forRoutes({ path: '*', method: RequestMethod.ALL });

    consumer.apply(
      session({
        name: 'session',
        secret: process.env.COOKIE_KEY!,
        resave: false,
        saveUninitialized: false,
        proxy: true,
        cookie: {
          httpOnly: true,
          secure: isProd,
          sameSite: isProd ? 'none' : 'lax',
          partitioned: isProd ? true : (undefined as any),
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: '/',
        } as any,
      }),
    ).forRoutes('*');
  }
}
