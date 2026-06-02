# Folder Structure and Coding Standards

## Overview

This document specifies the recommended folder structure and coding standards for both the Next.js frontend and NestJS backend components of CafeFlow. Following these conventions ensures consistency, maintainability, and scalability of the codebase.

## Recommended Project Structure

### Overall Structure
```
cafe-flow/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App Router pages and components
│   │   ├── components/      # Reusable UI components
│   │   ├── lib/             # Utility functions and helper modules
│   │   ├── hooks/           # Custom React hooks
│   │   ├── stores/          # State management (Zustand)
│   │   ├── styles/          # Global styles and Tailwind configurations
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   ├── .env.local           # Local environment variables
│   ├── tailwind.config.ts   # Tailwind CSS configuration
│   └── tsconfig.json        # TypeScript configuration
├── backend/                  # NestJS backend application
│   ├── src/
│   │   ├── auth/            # Authentication and authorization modules
│   │   ├── tenants/         # Tenant management modules
│   │   ├── businesses/      # Business management modules
│   │   ├── outlets/         # Outlet management modules
│   │   ├── tables/          # Table management modules
│   │   ├── menus/           # Menu management modules
│   │   ├── orders/          # Order management modules
│   │   ├── customers/       # Customer management modules
│   │   ├── loyalty/         # Loyalty program modules
│   │   ├── analytics/       # Analytics and reporting modules
│   │   ├── staff/           # Staff management modules
│   │   ├── notifications/   # Notification services modules
│   │   ├── payments/        # Payment processing modules
│   │   ├── integration/     # Third-party integrations (WhatsApp, etc.)
│   │   ├── common/          # Shared utilities and decorators
│   │   ├── modules/         # Core NestJS modules
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entities/        # Database entities (Prisma)
│   │   └── main.ts          # Application entry point
│   ├── prisma/              # Prisma schema and migrations
│   ├── test/                # Test files
│   ├── .env.local           # Local environment variables
│   └── nest-cli.json        # NestJS CLI configuration
├── docker-compose.yml       # Docker orchestration
├── Dockerfile               # Base container definition
├── README.md
└── package.json             # Root package file
```

### Frontend Specific Structure (Next.js)
```
frontend/src/
├── app/
│   ├── layout.tsx            # Root layout component
│   ├── page.tsx              # Home page
│   ├── login/
│   │   └── page.tsx          # Login page
│   ├── dashboard/
│   │   ├── layout.tsx        # Dashboard layout
│   │   ├── page.tsx          # Dashboard home
│   │   ├── menu/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── orders/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── customers/
│   │       ├── layout.tsx
│   │       └── page.tsx
│   └── api/                  # API routes
├── components/
│   ├── ui/                   # UI primitive components
│   ├── layout/               # Layout components
│   ├── forms/                # Form components
│   ├── dashboard/            # Dashboard specific components
│   └── shared/               # Reusable shared components
├── hooks/
│   ├── useAuth.ts            # Authentication hook
│   ├── useApi.ts             # API communication hook
│   └── useDashboard.ts       # Dashboard-specific hooks
├── lib/
│   └── apiClient.ts          # API client configuration
├── stores/
│   └── useStore.ts           # Zustand store configuration
├── utils/
│   ├── validators.ts         # Form validation functions
│   └── helpers.ts            # Helper functions
└── types/
    └── index.ts              # Global type definitions
```

### Backend Specific Structure (NestJS)
```
backend/src/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   └── strategies/
├── tenants/
│   ├── tenants.controller.ts
│   ├── tenants.service.ts
│   ├── tenants.module.ts
│   └── dto/
├── businesses/
│   ├── businesses.controller.ts
│   ├── businesses.service.ts
│   ├── businesses.module.ts
│   └── dto/
├── outlets/
│   ├── outlets.controller.ts
│   ├── outlets.service.ts
│   ├── outlets.module.ts
│   └── dto/
├── tables/
│   ├── tables.controller.ts
│   ├── tables.service.ts
│   ├── tables.module.ts
│   └── dto/
├── menus/
│   ├── menus.controller.ts
│   ├── menus.service.ts
│   ├── menus.module.ts
│   └── dto/
├── orders/
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   ├── orders.module.ts
│   └── dto/
├── customers/
│   ├── customers.controller.ts
│   ├── customers.service.ts
│   ├── customers.module.ts
│   └── dto/
├── loyalty/
│   ├── loyalty.controller.ts
│   ├── loyalty.service.ts
│   ├── loyalty.module.ts
│   └── dto/
├── analytics/
│   ├── analytics.controller.ts
│   ├── analytics.service.ts
│   ├── analytics.module.ts
│   └── dto/
├── staff/
│   ├── staff.controller.ts
│   ├── staff.service.ts
│   ├── staff.module.ts
│   └── dto/
├── notifications/
│   ├── notifications.controller.ts
│   ├── notifications.service.ts
│   ├── notifications.module.ts
│   └── dto/
├── payments/
│   ├── payments.controller.ts
│   ├── payments.service.ts
│   ├── payments.module.ts
│   └── dto/
├── integration/
│   ├── whatsapp/
│   │   ├── whatsapp.controller.ts
│   │   ├── whatsapp.service.ts
│   │   └── dto/
│   └── dto/
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── interceptors/
│   └── filters/
├── modules/
│   └── core.module.ts
├── dto/
│   └── base.dto.ts
├── entities/
│   └── base.entity.ts
└── main.ts
```

## Coding Standards

### TypeScript Standards

#### Naming Conventions
- **PascalCase** for interfaces, classes, and enums
- **camelCase** for variables and functions
- **UPPER_CASE** for constants
- **kebab-case** for file names
- **snake_case** for database column names
- **Prefix** with 'I' for interfaces (e.g., `IUser`, `IOrder`)

#### Type Safety
- Use TypeScript interfaces over type aliases for object shapes
- Define explicit return types for all functions
- Use union types for optional properties
- Implement discriminant unions for complex discriminated types
- Regularly use `unknown` with type guards instead of `any`

#### File Organization
- Import order: Built-ins, External packages, Internal modules
- Group imports by type
- Keep related code together in files
- Extract utility functions into separate files when reused
- Avoid deeply nested objects or arrays

### Frontend (Next.js) Standards

#### Component Structure
- Functional components with hooks rather than class components
- Consistent component interface with clear props
- Separation of presentation and logic components
- Reusable and configurable components
- Proper error boundaries and loading states

#### State Management
- Use `zustand` for global state management
- Avoid excessive prop drilling with React Context or Zustand
- Local component state for small UI interactions
- Async state handling with loading, success, error states

#### Styling
- Tailwind CSS with utility-first approach
- Follow design system components for consistency
- Use semantic HTML structure
- Proper accessibility attributes and ARIA labels
- Responsive design with mobile-first approach

#### API Integration
- Implement centralized API client with Axios or fetch
- Use custom hooks for API calls
- Error boundary handling for failed API requests
- Implement caching strategies for improved performance
- Request cancellation for components that unmount

#### Performance
- Implement code splitting with dynamic imports
- Lazy load components that aren't immediately visible
- Memoization of expensive computations
- Virtualized lists for large datasets
- Optimize images with appropriate sizes and formats

### Backend (NestJS) Standards

#### Module Separation
- One module per feature or domain concept
- Clear separation between controllers and services
- DTOs for input/output validation
- Entities for database mapping
- Single responsibility for each class

#### Service Design
- Pure service methods that perform business logic
- Inject dependencies rather than creating new instances
- Handle validation in DTOs or pipes
- Use repository pattern for database operations
- Error handling with custom exceptions

#### Controller Design
- Thin controllers that delegate to services
- Use NestJS pipes for input validation
- Define clear HTTP methods and status codes
- Consistent error response format
- API versioning for endpoints

#### Security
- Use DTO validation for input sanitization
- Implement proper authentication and authorization
- Never log sensitive information
- Implement rate limiting for API endpoints
- Use parameterized queries to prevent SQL injection

### Common Practices

#### Error Handling
- Use custom exception classes for different error scenarios
- Return consistent error format (both success and error responses)
- Log errors with appropriate context but without sensitive information
- Distinguish between application errors and system errors
- Implement retry mechanisms for transient failures

#### Logging
- Use structured logging for better traceability
- Include contextual information in logs
- Log at appropriate severity levels
- Avoid logging sensitive data such as passwords
- Use unique request IDs for tracing

#### Testing
- Write unit tests for services and business logic
- Implement integration tests for module interactions
- Use mock services for external dependencies
- Test edge cases and error conditions
- Ensure 80%+ test coverage for critical components

#### Documentation
- JSDoc-style comments for functions and classes
- Inline comments for complex logic
- README files explaining setup and usage
- API documentation using Swagger/OpenAPI
- Technical architecture and design documents

#### Git Integration
- Follow conventional commits for commit messages
- Use feature branches with descriptive names
- Squash commits before merging into main
- Write clear pull request descriptions
- Include changelog updates with major changes

### Code Quality Tools

#### Linting
- ESLint configuration for TypeScript
- Prettier for code formatting
- TSLint for TypeScript-specific linting
- Husky pre-commit hooks to enforce quality

#### Build Process
- TypeScript compilation with proper tsconfig.json settings
- Build optimization for production deployment
- Bundle analysis and optimization
- Environment-specific build configurations

This folder structure and coding standard guide ensures consistency across the CafeFlow codebase, facilitating collaboration, scalability, and long-term maintainability of the platform.