import { Module } from '@nestjs/common';
import { TwoFactorController } from './two-factor.controller';
import { TwoFactorService } from './two-factor.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';


@Module({
    imports: [
        UsersModule,
        JwtModule.register({}),
        ConfigModule,
    ],
    controllers: [TwoFactorController],
    providers: [TwoFactorService],
    exports: []
})
export class twoFactorModule { }
