import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../users/user.entity";


@Entity('listings')
export class ListingEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: false })
    approved: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    price: number;

    @Column()
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column()
    area: number;

    @Column()
    bedrooms: number;

    @ManyToOne(() => UserEntity, (user) => user.listings)
    user: UserEntity;
}
