"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenusModule = void 0;
const common_1 = require("@nestjs/common");
const menus_service_1 = require("./menus.service");
const menus_controller_1 = require("./menus.controller");
const typeorm_1 = require("@nestjs/typeorm");
const menu_entity_1 = require("../entities/menu.entity");
const menu_category_entity_1 = require("../entities/menu-category.entity");
const menu_item_entity_1 = require("../entities/menu-item.entity");
const outlet_entity_1 = require("../entities/outlet.entity");
const menu_gateway_1 = require("./menu.gateway");
const plans_module_1 = require("../plans/plans.module");
let MenusModule = class MenusModule {
};
exports.MenusModule = MenusModule;
exports.MenusModule = MenusModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([menu_entity_1.Menu, menu_category_entity_1.MenuCategory, menu_item_entity_1.MenuItem, outlet_entity_1.Outlet]), plans_module_1.PlansModule],
        controllers: [menus_controller_1.MenusController],
        providers: [menus_service_1.MenusService, menu_gateway_1.MenuGateway],
        exports: [menus_service_1.MenusService, menu_gateway_1.MenuGateway],
    })
], MenusModule);
//# sourceMappingURL=menus.module.js.map