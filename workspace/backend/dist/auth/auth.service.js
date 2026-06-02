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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const tenant_entity_1 = require("../entities/tenant.entity");
const business_entity_1 = require("../entities/business.entity");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
let AuthService = class AuthService {
    constructor(usersRepository, tenantsRepository, businessesRepository, jwtService) {
        this.usersRepository = usersRepository;
        this.tenantsRepository = tenantsRepository;
        this.businessesRepository = businessesRepository;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        const user = await this.usersRepository.findOne({
            where: { email },
        });
        if (user && await bcrypt.compare(password, user.passwordHash)) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = {
            email: user.email,
            id: user.id,
            name: user.name,
            tenantId: user.tenantId,
            businessId: user.businessId,
            role: user.role,
        };
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
            expires_in: 3600,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                tenantId: user.tenantId,
                businessId: user.businessId,
            }
        };
    }
    signToken(payload, expiresIn) {
        if (expiresIn) {
            return this.jwtService.sign(payload, { expiresIn });
        }
        return this.jwtService.sign(payload);
    }
    async register(userData) {
        const saltRounds = 10;
        const rawPassword = userData.password || userData.passwordHash || '';
        const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);
        const slug = (userData.businessName || 'cafe')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        const tenant = this.tenantsRepository.create({
            name: userData.businessName || 'My Cafe',
            slug,
        });
        const savedTenant = await this.tenantsRepository.save(tenant);
        const business = this.businessesRepository.create({
            name: userData.businessName || 'My Cafe',
            tenantId: savedTenant.id,
            ownerId: '',
        });
        const savedBusiness = await this.businessesRepository.save(business);
        const userInput = {
            name: userData.name || '',
            email: userData.email || '',
            passwordHash: hashedPassword,
            tenantId: savedTenant.id,
            businessId: savedBusiness.id,
            role: user_entity_1.UserRole.TENANT_OWNER,
            isActive: true,
        };
        const user = this.usersRepository.create(userInput);
        const savedUser = await this.usersRepository.save(user);
        savedBusiness.ownerId = savedUser.id;
        await this.businessesRepository.save(savedBusiness);
        return savedUser;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    __param(2, (0, typeorm_1.InjectRepository)(business_entity_1.Business)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map