"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLAN_LIMITS = exports.Plan = void 0;
var Plan;
(function (Plan) {
    Plan["FREE"] = "FREE";
    Plan["STARTER"] = "STARTER";
    Plan["PRO"] = "PRO";
    Plan["ENTERPRISE"] = "ENTERPRISE";
})(Plan || (exports.Plan = Plan = {}));
exports.PLAN_LIMITS = {
    [Plan.FREE]: {
        maxOutlets: 1,
        maxStaff: 3,
        maxMenus: 1,
        maxMenuItems: 50,
        maxCategoriesPerMenu: 10,
        hasAnalytics: false,
        hasLoyalty: true,
        hasCustomBranding: false,
        hasMultipleLanguages: false,
    },
    [Plan.STARTER]: {
        maxOutlets: 3,
        maxStaff: 10,
        maxMenus: 3,
        maxMenuItems: 200,
        maxCategoriesPerMenu: 20,
        hasAnalytics: true,
        hasLoyalty: true,
        hasCustomBranding: true,
        hasMultipleLanguages: false,
    },
    [Plan.PRO]: {
        maxOutlets: 10,
        maxStaff: 50,
        maxMenus: 10,
        maxMenuItems: 1000,
        maxCategoriesPerMenu: 50,
        hasAnalytics: true,
        hasLoyalty: true,
        hasCustomBranding: true,
        hasMultipleLanguages: true,
    },
    [Plan.ENTERPRISE]: {
        maxOutlets: -1,
        maxStaff: -1,
        maxMenus: -1,
        maxMenuItems: -1,
        maxCategoriesPerMenu: -1,
        hasAnalytics: true,
        hasLoyalty: true,
        hasCustomBranding: true,
        hasMultipleLanguages: true,
    },
};
//# sourceMappingURL=plan.config.js.map