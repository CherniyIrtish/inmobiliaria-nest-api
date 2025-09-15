import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1757922127134 implements MigrationInterface {
    name = 'Initial1757922127134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "listings" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "approved" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "price" integer NOT NULL, "title" varchar NOT NULL, "description" text NOT NULL, "area" integer NOT NULL, "bedrooms" integer NOT NULL, "userId" integer)`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "admin" boolean NOT NULL DEFAULT (0))`);
        await queryRunner.query(`CREATE TABLE "temporary_listings" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "approved" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "price" integer NOT NULL, "title" varchar NOT NULL, "description" text NOT NULL, "area" integer NOT NULL, "bedrooms" integer NOT NULL, "userId" integer, CONSTRAINT "FK_45d5c4642c4cad0229da0ec22e7" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_listings"("id", "approved", "createdAt", "updatedAt", "price", "title", "description", "area", "bedrooms", "userId") SELECT "id", "approved", "createdAt", "updatedAt", "price", "title", "description", "area", "bedrooms", "userId" FROM "listings"`);
        await queryRunner.query(`DROP TABLE "listings"`);
        await queryRunner.query(`ALTER TABLE "temporary_listings" RENAME TO "listings"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" RENAME TO "temporary_listings"`);
        await queryRunner.query(`CREATE TABLE "listings" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "approved" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "price" integer NOT NULL, "title" varchar NOT NULL, "description" text NOT NULL, "area" integer NOT NULL, "bedrooms" integer NOT NULL, "userId" integer)`);
        await queryRunner.query(`INSERT INTO "listings"("id", "approved", "createdAt", "updatedAt", "price", "title", "description", "area", "bedrooms", "userId") SELECT "id", "approved", "createdAt", "updatedAt", "price", "title", "description", "area", "bedrooms", "userId" FROM "temporary_listings"`);
        await queryRunner.query(`DROP TABLE "temporary_listings"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "listings"`);
    }

}
