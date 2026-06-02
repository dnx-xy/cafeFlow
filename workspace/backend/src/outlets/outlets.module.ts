import { Module } from '@nestjs/common';
import { OutletsService } from './outlets.service';
import { OutletsController } from './outlets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Outlet } from '../entities/outlet.entity';
import { Business } from '../entities/business.entity';
import { PlansModule } from '../plans/plans.module';

@Module({
  imports: [TypeOrmModule.forFeature([Outlet, Business]), PlansModule],
  controllers: [OutletsController],
  providers: [OutletsService],
  exports: [OutletsService],
})
export class OutletsModule {}