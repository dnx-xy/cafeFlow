import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoyaltyProgram } from '../entities/loyalty-program.entity';
import { PointTransaction } from '../entities/point-transaction.entity';

@Injectable()
export class LoyaltyService {
  constructor(
    @InjectRepository(LoyaltyProgram)
    private loyaltyProgramsRepository: Repository<LoyaltyProgram>,
    @InjectRepository(PointTransaction)
    private pointTransactionsRepository: Repository<PointTransaction>,
  ) {}

  async getLoyaltyProgram(tenantId: string, businessId: string): Promise<LoyaltyProgram> {
    return await this.loyaltyProgramsRepository.findOne({
      where: { tenantId, businessId },
    });
  }

  async createPointsTransaction(transactionData: Partial<PointTransaction>, tenantId: string): Promise<PointTransaction> {
    const transaction = this.pointTransactionsRepository.create({
      ...transactionData,
      tenantId,
    });
    return await this.pointTransactionsRepository.save(transaction);
  }

  async getCustomerPoints(tenantId: string, customerId: string): Promise<number> {
    const result = await this.pointTransactionsRepository.query(`
      SELECT COALESCE(SUM(CASE WHEN transactionType = 'EARNED' THEN points ELSE -points END), 0) as total_points
      FROM point_transactions
      WHERE tenantId = $1 AND customerId = $2
    `, [tenantId, customerId]);
    
    return result[0]?.total_points || 0;
  }
}