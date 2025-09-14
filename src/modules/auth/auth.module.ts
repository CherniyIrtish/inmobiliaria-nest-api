import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
    imports: [
        ConfigModule,
        UsersModule,
        JwtModule.registerAsync({
            global: true,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (cfg: ConfigService) => ({
                secret: cfg.getOrThrow<string>('JWT_SECRET'),
                signOptions: { expiresIn: '15m' },
            }),
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: []
})
export class AuthModule { }