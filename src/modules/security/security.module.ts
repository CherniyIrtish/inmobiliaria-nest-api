import { Module } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UsersModule } from '../users/users.module';


@Module({
    imports: [UsersModule],
    providers: [AuthGuard],
    exports: [AuthGuard, UsersModule],
})
export class SecurityModule { }