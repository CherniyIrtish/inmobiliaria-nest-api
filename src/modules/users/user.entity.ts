import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { ListingEntity } from "../listings/listing.entity";


@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ default: false })
    admin: boolean;

    @OneToMany(() => ListingEntity, (listing) => listing.user)
    listings: ListingEntity[];

    @Column({ default: false })
    totpEnabled: boolean;

    @Column({ type: 'text', nullable: true })
    totpSecretEnc: string | null;

    @Column({ type: 'datetime', nullable: true })
    totpVerifiedAt: Date | null;

    @Column({ default: 0 })
    tokenVersion: number;

    @Column({ default: false })
    totpRequired: boolean;

    @AfterRemove()
    logRemove() {
        console.log(`Deleted User with id ${this.id}`);
    }

    @AfterUpdate()
    logUpdate() {
        console.log(`Updated User with id ${this.id}`);
    }

    @AfterInsert()
    logInsert() {
        console.log(`Inserted User with id ${this.id}`);
    }
}