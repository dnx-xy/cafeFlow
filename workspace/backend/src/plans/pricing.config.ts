export interface PlanPricing {
  name: string;
  price: number;
  priceId: string;
  description: string;
  features: string[];
  popular?: boolean;
  suitableFor?: string[];
}

export const PLAN_PRICING: Record<string, PlanPricing> = {
  FREE: {
    name: 'Free',
    price: 0,
    priceId: 'free',
    description: 'Try CafeFlow',
    features: ['1 outlet', '20 menu items', 'QR Menu', 'QR per table', 'Order via WhatsApp', 'Basic analytics', 'CafeFlow branding'],
  },
  STARTER: {
    name: 'Starter',
    price: 19,
    priceId: 'price_starter',
    description: 'Digital menu & ordering',
    features: ['1 outlet', 'Unlimited QR tables', 'Unlimited menu categories', 'Up to 200 menu items', 'Order management', 'Basic sales analytics', 'Menu availability (sold out)', 'Custom branding', 'Email support'],
    suitableFor: ['Independent cafe', 'Coffee shop', 'Bakery', 'Food stall'],
  },
  PRO: {
    name: 'Growth',
    price: 49,
    priceId: 'price_pro',
    description: 'Loyalty & customer retention',
    features: ['Up to 3 outlets', 'Customer CRM', 'Customer database', 'Visit history', 'Loyalty program', 'Rewards & points', 'Review Booster (Google)', 'Customer insights', 'Data export', 'WhatsApp integration'],
    popular: true,
    suitableFor: ['Single cafe focused on loyalty', 'Coffee shop building repeat visits'],
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 129,
    priceId: 'price_enterprise',
    description: 'Multi-outlet & growth',
    features: ['Up to 10 outlets', '50 staff accounts', 'Advanced analytics', 'Multi-language', 'Team & role management', 'Campaign management', 'Customer segmentation', 'API access', 'Priority support'],
    suitableFor: ['Multi-branch brand', 'Local franchise', 'Restaurant group'],
  },
};