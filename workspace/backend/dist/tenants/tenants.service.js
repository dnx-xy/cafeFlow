"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tenant_entity_1 = require("../entities/tenant.entity");
const business_entity_1 = require("../entities/business.entity");
const outlet_entity_1 = require("../entities/outlet.entity");
const user_entity_1 = require("../entities/user.entity");
const qr_code_entity_1 = require("../entities/qr-code.entity");
const qr_codes_service_1 = require("../qr-codes/qr-codes.service");
const bcrypt = __importStar(require("bcryptjs"));
let TenantsService = class TenantsService {
    constructor(tenantsRepository, businessesRepository, outletsRepository, usersRepository, qrCodesRepository, qrCodesService) {
        this.tenantsRepository = tenantsRepository;
        this.businessesRepository = businessesRepository;
        this.outletsRepository = outletsRepository;
        this.usersRepository = usersRepository;
        this.qrCodesRepository = qrCodesRepository;
        this.qrCodesService = qrCodesService;
    }
    async create(name, slug) {
        const tenant = this.tenantsRepository.create({
            name,
            slug,
        });
        return await this.tenantsRepository.save(tenant);
    }
    async createRealTenant(data) {
        const tenant = this.tenantsRepository.create({
            name: data.name,
            slug: data.slug,
            type: 'real',
        });
        const savedTenant = await this.tenantsRepository.save(tenant);
        const business = this.businessesRepository.create({
            name: data.businessName || data.name,
            tenantId: savedTenant.id,
            ownerId: '',
        });
        const savedBusiness = await this.businessesRepository.save(business);
        const outlet = this.outletsRepository.create({
            name: 'Main Outlet',
            businessId: savedBusiness.id,
            tenantId: savedTenant.id,
        });
        await this.outletsRepository.save(outlet);
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = this.usersRepository.create({
            name: data.name,
            email: data.email,
            passwordHash: hashedPassword,
            tenantId: savedTenant.id,
            businessId: savedBusiness.id,
            role: user_entity_1.UserRole.TENANT_OWNER,
            isActive: true,
        });
        const savedUser = await this.usersRepository.save(user);
        savedBusiness.ownerId = savedUser.id;
        await this.businessesRepository.save(savedBusiness);
        return { tenant: savedTenant, business: savedBusiness, user: savedUser };
    }
    async createQuickTenant(data) {
        const slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
            .slice(0, 50);
        const tenant = this.tenantsRepository.create({
            name: data.name,
            slug: `${slug}-${Date.now().toString(36)}`,
            type: 'quick',
        });
        const savedTenant = await this.tenantsRepository.save(tenant);
        const business = this.businessesRepository.create({
            name: data.name,
            tenantId: savedTenant.id,
            ownerId: '',
        });
        const savedBusiness = await this.businessesRepository.save(business);
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = this.usersRepository.create({
            name: data.name,
            email: data.email,
            passwordHash: hashedPassword,
            tenantId: savedTenant.id,
            businessId: savedBusiness.id,
            role: user_entity_1.UserRole.TENANT_OWNER,
            isActive: true,
        });
        const savedUser = await this.usersRepository.save(user);
        savedBusiness.ownerId = savedUser.id;
        await this.businessesRepository.save(savedBusiness);
        const qrCode = await this.qrCodesService.generateBusinessQrCode(savedBusiness.id, savedTenant.id);
        return { tenant: savedTenant, business: savedBusiness, user: savedUser, qrCode };
    }
    async findOneById(id) {
        return await this.tenantsRepository.findOne({
            where: { id },
        });
    }
    async findOneBySlug(slug) {
        return await this.tenantsRepository.findOne({
            where: { slug },
        });
    }
    async findAll() {
        const tenants = await this.tenantsRepository.find();
        const result = [];
        for (const tenant of tenants) {
            const item = {
                id: tenant.id,
                name: tenant.name,
                slug: tenant.slug,
                type: tenant.type || 'real',
                createdAt: tenant.createdAt,
                updatedAt: tenant.updatedAt,
            };
            try {
                const business = await this.businessesRepository.findOne({
                    where: { tenantId: tenant.id },
                });
                if (business) {
                    item.businessId = business.id;
                    item.logoUrl = business.logoUrl;
                    if (item.type === 'quick') {
                        const qrCode = await this.qrCodesRepository.findOne({
                            where: { businessId: business.id, tableId: null },
                            order: { createdAt: 'DESC' },
                        });
                        if (qrCode) {
                            item.qrCode = { code: qrCode.code, id: qrCode.id };
                        }
                    }
                }
            }
            catch {
            }
            result.push(item);
        }
        return result;
    }
};
exports.TenantsService = TenantsService;
exports.TenantsService = TenantsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    __param(1, (0, typeorm_1.InjectRepository)(business_entity_1.Business)),
    __param(2, (0, typeorm_1.InjectRepository)(outlet_entity_1.Outlet)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(4, (0, typeorm_1.InjectRepository)(qr_code_entity_1.QrCode)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        qr_codes_service_1.QrCodesService])
], TenantsService);
//# sourceMappingURL=tenants.service.js.map