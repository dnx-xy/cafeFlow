"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlansModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const plans_service_1 = require("./plans.service");
const business_entity_1 = require("../entities/business.entity");
const outlet_entity_1 = require("../entities/outlet.entity");
const staff_entity_1 = require("../entities/staff.entity");
const menu_entity_1 = require("../entities/menu.entity");
const menu_item_entity_1 = require("../entities/menu-item.entity");
let PlansModule = class PlansModule {
};
exports.PlansModule = PlansModule;
exports.PlansModule = PlansModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([business_entity_1.Business, outlet_entity_1.Outlet, staff_entity_1.Staff, menu_entity_1.Menu, menu_item_entity_1.MenuItem])],
        providers: [plans_service_1.PlansService],
        exports: [plans_service_1.PlansService],
    })
], PlansModule);
//# sourceMappingURL=plans.module.js.map