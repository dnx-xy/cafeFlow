"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticatedUser = exports.SkipSubscription = exports.SKIP_SUBSCRIPTION_KEY = exports.Public = exports.IS_PUBLIC_KEY = exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;
exports.IS_PUBLIC_KEY = 'isPublic';
const Public = () => (0, common_1.SetMetadata)(exports.IS_PUBLIC_KEY, true);
exports.Public = Public;
exports.SKIP_SUBSCRIPTION_KEY = 'skipSubscription';
const SkipSubscription = () => (0, common_1.SetMetadata)(exports.SKIP_SUBSCRIPTION_KEY, true);
exports.SkipSubscription = SkipSubscription;
exports.AuthenticatedUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});
//# sourceMappingURL=auth.decorators.js.map