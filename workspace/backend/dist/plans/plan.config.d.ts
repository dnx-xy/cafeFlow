export declare enum Plan {
    FREE = "FREE",
    STARTER = "STARTER",
    PRO = "PRO",
    ENTERPRISE = "ENTERPRISE"
}
export interface PlanLimits {
    maxOutlets: number;
    maxStaff: number;
    maxMenus: number;
    maxMenuItems: number;
    maxCategoriesPerMenu: number;
    hasAnalytics: boolean;
    hasLoyalty: boolean;
    hasCustomBranding: boolean;
    hasMultipleLanguages: boolean;
}
export declare const PLAN_LIMITS: Record<Plan, PlanLimits>;
