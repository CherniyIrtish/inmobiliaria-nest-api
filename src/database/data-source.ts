import path from 'path';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { UserEntity } from '../modules/users/user.entity';
import { ListingEntity } from '../modules/listings/listing.entity';


const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

const sqliteOptions: SqliteConnectionOptions = {
    type: 'sqlite',
    database: isTest ? 'test.sqlite' : 'db.sqlite',
    entities: [ListingEntity, UserEntity],
    // migrations: ['src/database/migrations/*.ts'],
    migrations: [path.join(__dirname, 'migrations', '*{.ts,.js}')],
    synchronize: isTest ? true : false,
};

const postgresOptions: PostgresConnectionOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [ListingEntity, UserEntity],
    migrations: [path.join(__dirname, 'migrations', '*.js')],
    synchronize: true,
    ssl: { rejectUnauthorized: false },
};

export const AppDataSource = new DataSource(isProd ? postgresOptions : sqliteOptions);