import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from '../entities/staff.entity';
import { User } from '../entities/user.entity';
import { PlansModule } from '../plans/plans.module';

@Module({
  imports: [TypeOrmModule.forFeature([Staff, User]), PlansModule],
  controllers: [StaffController],
  providers: [StaffService],
  exports: [StaffService],
})
export class StaffModule {}