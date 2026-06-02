export enum Plan {
  FREE = 'FREE',
  STARTER = 'STARTER',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
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

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
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
