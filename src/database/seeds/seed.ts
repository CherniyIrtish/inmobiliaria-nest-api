import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import 'dotenv/config';
import { AppDataSource } from '../data-source';
import { UserEntity } from 'src/modules/users/user.entity';


const scrypt = promisify(_scrypt)


async function run() {
    // инициализируем DS (убедись, что миграции уже накатаны)
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    // чтобы сид повторно не дублировал — проверим наличие
    const userRepo = AppDataSource.getRepository(UserEntity);

    // sample users
    const exists = await userRepo.count();
    if (exists === 0) {

        const adminEmail = 'admin@example.com';
        const adminPassword = '111';

        const adminSalt = randomBytes(8).toString('hex');
        const adminHash = (await scrypt(adminPassword, adminSalt, 32) as Buffer);
        const adminResult = `${adminSalt}.${adminHash.toString('hex')}`;
        const admin = userRepo.create({ email: adminEmail, password: adminResult, admin: true });

        const userEmail = 'user@example.com';
        const userPassword = '222';

        const userSalt = randomBytes(8).toString('hex');
        const userHash = (await scrypt(userPassword, userSalt, 32) as Buffer);
        const userResult = `${userSalt}.${userHash.toString('hex')}`;
        const user = userRepo.create({ email: userEmail, password: userResult, admin: false });

        await userRepo.save([admin, user]);

        console.log('✅ Seed complete: users');
    } else {
        console.log('ℹ️ Seed skipped: data already present');
    }

    await AppDataSource.destroy();
}

run().catch(async (e) => {
    console.error('Seed error:', e);
    try { if (AppDataSource.isInitialized) await AppDataSource.destroy(); } catch { }
    process.exit(1);
});