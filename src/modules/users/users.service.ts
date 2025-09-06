import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}
