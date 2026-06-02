import { Module } from '@nestjs/common';
import { LoyaltyService } from './loyalty.service';
import { LoyaltyController } from './loyalty.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoyaltyProgram } from '../entities/loyalty-program.entity';
import { PointTransaction } from '../entities/point-transaction.entity';
import { LoyaltyReward } from '../entities/loyalty-reward.entity';
import { LoyaltyTierRule } from '../entities/loyalty-tier-rule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LoyaltyProgram, PointTransaction, LoyaltyReward, LoyaltyTierRule])],
  controllers: [LoyaltyController],
  providers: [LoyaltyService],
  exports: [LoyaltyService],
})
export class LoyaltyModule {}