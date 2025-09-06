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