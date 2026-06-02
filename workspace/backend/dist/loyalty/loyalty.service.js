"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoyaltyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const loyalty_program_entity_1 = require("../entities/loyalty-program.entity");
const point_transaction_entity_1 = require("../entities/point-transaction.entity");
let LoyaltyService = class LoyaltyService {
    constructor(loyaltyProgramsRepository, pointTransactionsRepository) {
        this.loyaltyProgramsRepository = loyaltyProgramsRepository;
        this.pointTransactionsRepository = pointTransactionsRepository;
    }
    async getLoyaltyProgram(tenantId, businessId) {
        return await this.loyaltyProgramsRepository.findOne({
            where: { tenantId, businessId },
        });
    }
    async createPointsTransaction(transactionData, tenantId) {
        const transaction = this.pointTransactionsRepository.create({
            ...transactionData,
            tenantId,
        });
        return await this.pointTransactionsRepository.save(transaction);
    }
    async getCustomerPoints(tenantId, customerId) {
        const result = await this.pointTransactionsRepository.query(`
      SELECT COALESCE(SUM(CASE WHEN transactionType = 'EARNED' THEN points ELSE -points END), 0) as total_points
      FROM point_transactions
      WHERE tenantId = $1 AND customerId = $2
    `, [tenantId, customerId]);
        return result[0]?.total_points || 0;
    }
};
exports.LoyaltyService = LoyaltyService;
exports.LoyaltyService = LoyaltyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(loyalty_program_entity_1.LoyaltyProgram)),
    __param(1, (0, typeorm_1.InjectRepository)(point_transaction_entity_1.PointTransaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], LoyaltyService);
//# sourceMappingURL=loyalty.service.js.map