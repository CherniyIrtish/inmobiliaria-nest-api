import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoProd1758413217813 implements MigrationInterface {
    name = 'AutoProd1758413217813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" DROP CONSTRAINT "FK_45d5c4642c4cad0229da0ec22e7"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "totpEnabled" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD "totpSecretEnc" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD "totpVerifiedAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "users" ADD "tokenVersion" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "totpRequired" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "listings" ADD CONSTRAINT "FK_45d5c4642c4cad0229da0ec22e7" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" DROP CONSTRAINT "FK_45d5c4642c4cad0229da0ec22e7"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "totpRequired"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "tokenVersion"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "totpVerifiedAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "totpSecretEnc"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "totpEnabled"`);
        await queryRunner.query(`ALTER TABLE "listings" ADD CONSTRAINT "FK_45d5c4642c4cad0229da0ec22e7" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
