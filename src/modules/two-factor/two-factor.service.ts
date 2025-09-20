import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import * as crypto from 'crypto';
import * as qrcode from 'qrcode';
import { UsersService } from '../users/users.service';


@Injectable()
export class TwoFactorService {
    private TOTP_ENC_KEY: Buffer; // 32 bytes

    constructor(
        private readonly _usersService: UsersService,
        private readonly _configService: ConfigService,
    ) {
        const raw = this._configService.get<string>('TOTP_ENC_KEY');

        if (!raw) {
            throw new Error('TOTP_ENC_KEY is required (32-byte hex)');
        }

        const key = Buffer.from(raw, 'hex');

        if (key.length !== 32) {
            throw new Error('TOTP_ENC_KEY must be 32-byte hex (64 hex chars)');
        }

        this.TOTP_ENC_KEY = key;

        authenticator.options = { step: 30, window: 1 };
    }

    private encrypt(text: string) {
        const iv = crypto.randomBytes(12); // GCM nonce
        const cipher = crypto.createCipheriv('aes-256-gcm', this.TOTP_ENC_KEY, iv);
        const enc = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
        const tag = cipher.getAuthTag();
        return Buffer.concat([iv, tag, enc]).toString('base64'); // iv|tag|cipher
    }

    private decrypt(payload: string) {
        const buf = Buffer.from(payload, 'base64');
        const iv = buf.subarray(0, 12);
        const tag = buf.subarray(12, 28);
        const enc = buf.subarray(28);
        const decipher = crypto.createDecipheriv('aes-256-gcm', this.TOTP_ENC_KEY, iv);

        decipher.setAuthTag(tag);

        const dec = Buffer.concat([decipher.update(enc), decipher.final()]);

        return dec.toString('utf8');
    }

    async setup(userId: number) {
        const user = await this._usersService.findOne(userId);

        if (!user) throw new BadRequestException('User not found');

        const secret = authenticator.generateSecret();
        const otpauth = authenticator.keyuri(user.email, 'Inmobiliaria', secret);
        const secretEnc = this.encrypt(secret);

        await this._usersService.userUpdate(userId, { totpSecretEnc: secretEnc });

        const qrDataUrl = await qrcode.toDataURL(otpauth, { width: 256, margin: 1 });

        return { qrDataUrl };
    }

    async verify(userId: number, token: string) {
        const user = await this._usersService.findOne(userId);

        if (!user || !user.totpSecretEnc) {
            throw new BadRequestException('TOTP is not initialized');
        }

        const secret = this.decrypt(user.totpSecretEnc);
        const ok = authenticator.verify({ token, secret });

        if (!ok) throw new BadRequestException('Invalid code');

        await this._usersService.require2fa(userId, true);
        await this._usersService.userUpdate(userId, { totpEnabled: true, totpVerifiedAt: new Date() });

        return { ok: true };
    }
}