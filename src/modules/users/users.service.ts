import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { UserEntity } from './user.entity';


@Injectable()
export class UsersService {
    constructor(@InjectRepository(UserEntity) private _repo: Repository<UserEntity>) { }

    create(email: string, password: string) {
        const user = this._repo.create({ email, password });

        return this._repo.save(user);
    }

    findOne(id: number) {
        if (!id) return null;

        return this._repo.findOneBy({ id });
    }

    async find(email: string) {
        if (!email) throw new BadRequestException('Email is required');

        return this._repo.find({ where: { email } });
    }

    async getUsers(currentUser: UserEntity) {
        return this._repo.find({ where: { id: Not(currentUser.id) }, relations: { listings: true } });
    }

    async deleteUser(userId: number) {
        const userToDelete = await this._repo.findOne({ where: { id: userId } });

        if (!userToDelete) throw new NotFoundException('User not found');

        return this._repo.remove(userToDelete);
    }

    async userUpdate(userId: number, dto: Partial<UserEntity>): Promise<UserEntity> {
        const user = await this._repo.findOne({ where: { id: userId } });

        if (!user) throw new NotFoundException('User not found');

        const updated = this._repo.merge(user, dto);

        return this._repo.save(updated);
    }

    async require2fa(userId: number, totpRequired: boolean): Promise<UserEntity> {
        const patch = totpRequired
            ? { totpRequired: true }
            : {
                totpRequired: false,
                totpEnabled: false,
                totpSecretEnc: null,
                totpVerifiedAt: null,
            };

        await this._repo.update({ id: userId }, patch);

        await this._repo.increment({ id: userId }, 'tokenVersion', 1);

        const updated = await this._repo.findOne({ where: { id: userId } });

        if (!updated) throw new NotFoundException('User not found');

        return updated;
    }
}
