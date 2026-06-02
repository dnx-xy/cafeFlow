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
exports.TablesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const table_entity_1 = require("../entities/table.entity");
const outlet_entity_1 = require("../entities/outlet.entity");
const qr_code_entity_1 = require("../entities/qr-code.entity");
let TablesService = class TablesService {
    constructor(tablesRepository, outletsRepository, qrCodesRepository) {
        this.tablesRepository = tablesRepository;
        this.outletsRepository = outletsRepository;
        this.qrCodesRepository = qrCodesRepository;
    }
    async create(tableData, tenantId, businessId, outletId) {
        if (!outletId) {
            let outlet = await this.outletsRepository.findOne({ where: { businessId }, order: { createdAt: 'ASC' } });
            if (!outlet) {
                outlet = this.outletsRepository.create({
                    name: 'Main Outlet',
                    businessId,
                    tenantId,
                });
                outlet = await this.outletsRepository.save(outlet);
            }
            outletId = outlet.id;
        }
        if (!tableData.number) {
            tableData.number = `T${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
        }
        const table = this.tablesRepository.create({
            ...tableData,
            tenantId,
            outletId,
        });
        const savedTable = await this.tablesRepository.save(table);
        const qrCode = this.qrCodesRepository.create({
            code: `cf-${tenantId.substring(0, 6)}-${savedTable.id.substring(0, 8)}`,
            tableId: savedTable.id,
            businessId,
        });
        await this.qrCodesRepository.save(qrCode);
        return await this.findOne(savedTable.id, tenantId);
    }
    async findAll(tenantId, outletId) {
        const where = { tenantId };
        if (outletId) {
            where.outletId = outletId;
        }
        return await this.tablesRepository.find({ where });
    }
    async findOne(id, tenantId) {
        return await this.tablesRepository.findOne({
            where: { id, tenantId },
            relations: { qrCodes: true },
        });
    }
    async update(id, updateTableDto, tenantId) {
        await this.tablesRepository.update({ id, tenantId }, updateTableDto);
        return await this.findOne(id, tenantId);
    }
    async remove(id, tenantId) {
        await this.tablesRepository.delete({ id, tenantId });
    }
    async getCountByOutlet(outletId, tenantId) {
        const [result, count] = await Promise.all([
            this.tablesRepository.query(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN active = true THEN 1 ELSE 0 END) as active,
          SUM(CASE WHEN active = false THEN 1 ELSE 0 END) as inactive
        FROM tables t
        WHERE t.outletId = $1 AND t.tenantId = $2
      `, [outletId, tenantId]),
            this.tablesRepository.count({
                where: { outletId, tenantId }
            })
        ]);
        return {
            count: count,
            active: parseInt(result[0].active) || 0,
            inactive: parseInt(result[0].inactive) || 0
        };
    }
};
exports.TablesService = TablesService;
exports.TablesService = TablesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(table_entity_1.Table)),
    __param(1, (0, typeorm_1.InjectRepository)(outlet_entity_1.Outlet)),
    __param(2, (0, typeorm_1.InjectRepository)(qr_code_entity_1.QrCode)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TablesService);
//# sourceMappingURL=tables.service.js.map