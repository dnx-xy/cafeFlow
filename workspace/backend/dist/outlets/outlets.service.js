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
exports.OutletsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const outlet_entity_1 = require("../entities/outlet.entity");
const plans_service_1 = require("../plans/plans.service");
let OutletsService = class OutletsService {
    constructor(outletsRepository, plansService) {
        this.outletsRepository = outletsRepository;
        this.plansService = plansService;
    }
    async create(outletData, tenantId, businessId) {
        await this.plansService.enforceOutletLimit(businessId);
        const outlet = this.outletsRepository.create({
            ...outletData,
            tenantId,
            businessId,
        });
        return await this.outletsRepository.save(outlet);
    }
    async findAll(tenantId, businessId) {
        const where = { tenantId };
        if (businessId) {
            where.businessId = businessId;
        }
        return await this.outletsRepository.find({ where });
    }
    async findOne(id, tenantId) {
        return await this.outletsRepository.findOne({
            where: { id, tenantId },
        });
    }
    async update(id, updateOutletDto, tenantId) {
        await this.outletsRepository.update({ id, tenantId }, updateOutletDto);
        return await this.findOne(id, tenantId);
    }
    async remove(id, tenantId) {
        await this.outletsRepository.delete({ id, tenantId });
    }
};
exports.OutletsService = OutletsService;
exports.OutletsService = OutletsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(outlet_entity_1.Outlet)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        plans_service_1.PlansService])
], OutletsService);
//# sourceMappingURL=outlets.service.js.map