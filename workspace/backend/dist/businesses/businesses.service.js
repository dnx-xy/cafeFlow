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
exports.BusinessesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const business_entity_1 = require("../entities/business.entity");
let BusinessesService = class BusinessesService {
    constructor(businessesRepository) {
        this.businessesRepository = businessesRepository;
    }
    async create(createBusinessDto, tenantId, ownerId) {
        const business = this.businessesRepository.create({
            ...createBusinessDto,
            tenantId,
            ownerId,
        });
        return await this.businessesRepository.save(business);
    }
    async findAll(tenantId) {
        return await this.businessesRepository.find({
            where: { tenantId },
        });
    }
    async findOne(id, tenantId) {
        return await this.businessesRepository.findOne({
            where: { id, tenantId },
        });
    }
    async update(id, updateBusinessDto, tenantId) {
        await this.businessesRepository.update({ id, tenantId }, updateBusinessDto);
        return await this.findOne(id, tenantId);
    }
    async remove(id, tenantId) {
        await this.businessesRepository.delete({ id, tenantId });
    }
};
exports.BusinessesService = BusinessesService;
exports.BusinessesService = BusinessesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(business_entity_1.Business)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BusinessesService);
//# sourceMappingURL=businesses.service.js.map