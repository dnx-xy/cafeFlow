# CafeFlow - Digital Ordering Platform

This is the workspace for the CafeFlow digital ordering platform implementation based on the blueprints.

## Project Structure

```
workspace/
├── frontend/          # Next.js frontend application
│   ├── src/
│   │   ├── app/       # App Router pages and components
│   │   ├── components/ # Reusable UI components
│   │   ├── lib/       # Utility functions and helper modules
│   │   ├── hooks/     # Custom React hooks
│   │   ├── stores/    # State management (Zustand)
│   │   ├── styles/    # Global styles and Tailwind configurations
│   │   ├── types/     # TypeScript type definitions
│   │   └── utils/     # Utility functions
│   └── package.json   # Frontend dependencies
├── backend/           # NestJS backend application
│   ├── src/
│   │   ├── auth/      # Authentication and authorization modules
│   │   ├── tenants/   # Tenant management modules
│   │   ├── businesses/ # Business management modules
│   │   ├── outlets/   # Outlet management modules
│   │   ├── tables/    # Table management modules
│   │   ├── menus/     # Menu management modules
│   │   ├── orders/    # Order management modules
│   │   ├── customers/ # Customer management modules
│   │   ├── loyalty/   # Loyalty program modules
│   │   ├── analytics/ # Analytics and reporting modules
│   │   ├── staff/     # Staff management modules
│   │   ├── notifications/ # Notification services modules
│   │   ├── payments/  # Payment processing modules
│   │   ├── integration/ # Third-party integrations (WhatsApp, etc.)
│   │   ├── common/    # Shared utilities and decorators
│   │   ├── modules/   # Core NestJS modules
│   │   ├── dto/       # Data Transfer Objects
│   │   ├── entities/  # Database entities (TypeORM)
│   │   └── main.ts    # Application entry point
│   └── package.json   # Backend dependencies
└── docker-compose.yml # Docker orchestration
```

## Getting Started

1. Install dependencies:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

2. Start the development environment:
   ```bash
   docker-compose up
   ```

3. Access the applications:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Development Guidelines

Follow the coding standards outlined in the blueprints:
- Use TypeScript for type safety
- Follow the folder structure and naming conventions
- Implement proper authentication and authorization
- Use DTOs for input/output validation
- Implement proper error handling
- Use database entities for data persistence