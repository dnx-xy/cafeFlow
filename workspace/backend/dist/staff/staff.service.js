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
exports.StaffService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const staff_entity_1 = require("../entities/staff.entity");
let StaffService = class StaffService {
    constructor(staffRepository) {
        this.staffRepository = staffRepository;
    }
    async create(staffData, tenantId, userId, outletId) {
        const staff = this.staffRepository.create({
            ...staffData,
            tenantId,
            userId,
            outletId,
        });
        return await this.staffRepository.save(staff);
    }
    async findAll(tenantId, outletId) {
        const where = { tenantId };
        if (outletId) {
            where.outletId = outletId;
        }
        return await this.staffRepository.find({
            where,
            relations: { user: true },
        });
    }
    async findOne(id, tenantId) {
        return await this.staffRepository.findOne({
            where: { id, tenantId },
            relations: { user: true, outlet: true },
        });
    }
    async update(id, updateStaffDto, tenantId) {
        await this.staffRepository.update({ id, tenantId }, updateStaffDto);
        return await this.findOne(id, tenantId);
    }
    async remove(id, tenantId) {
        await this.staffRepository.delete({ id, tenantId });
    }
};
exports.StaffService = StaffService;
exports.StaffService = StaffService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(staff_entity_1.Staff)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StaffService);
//# sourceMappingURL=staff.service.js.map