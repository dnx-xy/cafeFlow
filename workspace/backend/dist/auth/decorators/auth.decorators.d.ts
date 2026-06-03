import { UserRole } from '../../entities/user.entity';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: UserRole[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const IS_PUBLIC_KEY = "isPublic";
export declare const Public: () => import("@nestjs/common").CustomDecorator<string>;
export declare const SKIP_SUBSCRIPTION_KEY = "skipSubscription";
export declare const SkipSubscription: () => import("@nestjs/common").CustomDecorator<string>;
export declare const AuthenticatedUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
