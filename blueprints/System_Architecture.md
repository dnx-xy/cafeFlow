# System Architecture Diagram

## Overview

CafeFlow follows a modern microservices-based architecture with a focus on scalability, maintainability, and data isolation for multi-tenancy. The system is designed to handle thousands of concurrent users while maintaining security and performance standards.

## Architecture Components

### 1. Client Layer
- **Web Application**: React-based frontend served via Next.js
- **Mobile/Web Responsive Interface**: Single codebase serving both mobile and desktop
- **Customer Experience**: Optimized for quick ordering and seamless checkout

### 2. API Gateway
- **Authentication & Authorization**: JWT-based authentication
- **Request Routing**: Handles cross-domain requests and CORS
- **API Rate Limiting**: Prevents abuse and ensures fair usage
- **Request Validation**: Sanitizes input before reaching backend services

### 3. Backend Services
- **Tenant Management Service**: Handles multi-tenancy isolation
- **Menu Management Service**: Manages menus, categories, and items
- **Order Processing Service**: Orchestrates orders and routing
- **Customer Management Service**: Handles loyalty programs and CRM
- **Analytics Service**: Processes and presents business intelligence
- **Notification Service**: Manages real-time communication and alerts
- **WhatsApp Integration Service**: Handles WhatsApp messaging and order generation

### 4. Middleware & Infrastructure
- **Message Broker**: Redis for caching and pub/sub events
- **Database Cluster**: PostgreSQL with read replicas for analytics
- **File Storage**: S3-compatible storage for menu images and documents
- **Real-time Communication**: Socket.IO for live updates

### 5. Data Layer
- **Primary Database**: PostgreSQL for ACID-compliant transactions
- **Cache Layer**: Redis for session management and frequently accessed data
- **Data Warehouse**: For analytics and reporting
- **Backup & Disaster Recovery**: Automated backups with point-in-time recovery

## Multi-Tenant Isolation Pattern

Each tenant follows the hierarchical data model:
```
Tenant (isolated)
│
├── Business (unique to tenant)
│   │
│   ├── Outlet (physical location)
│   │   │
│   │   ├── Table (QR code assignment)
│   │   │
│   │   └── Menu (per outlet)
│   │
│   └── Users (staff members)
│
└── Customer Database (tenant-specific)
```

## Data Flow

1. **Customer Interaction**:
   - Scan QR code → Route to specific table menu
   - Browse menu → Retrieve from cache/database
   - Add to cart → Session managed via Redis
   - Submit order → Trigger order processing pipeline

2. **Order Processing Pipeline**:
   - Order received → Validate and parse
   - Route order → Based on business configuration
   - Process payment → Through Midtrans
   - Create customer record → If new customer
   - Update analytics → Real-time metrics
   - Notify relevant parties → Staff or WhatsApp

3. **Internal Operations**:
   - Daily analytics batch processing
   - Inventory update synchronization
   - Loyalty point balance calculation
   - Newsletter/campaign distribution

## Technology Stack Implementation

### Frontend (Next.js)
- **Framework**: Next.js App Router for server-side rendering
- **State Management**: Zustand for lightweight application state
- **UI Components**: shadcn/UI components with Tailwind CSS styling
- **API Communication**: TanStack Query for data fetching and caching

### Backend (NestJS)
- **Framework**: NestJS with TypeScript for type-safe development
- **Modules**: Feature-based module organization for maintainability
- **Authentication**: JWT and refresh token rotation
- **API Docs**: Swagger/OpenAPI specification

### Data Layer
- **Database**: PostgreSQL with Prisma ORM for type safety
- **Caching**: Redis for session management and hot data
- **Storage**: S3-compatible object storage for images and documents
- **Search**: Elasticsearch or PostgreSQL full-text search for menu items

### Infrastructure
- **Containers**: Docker for packaging services
- **Orchestration**: Kubernetes deployment strategy for scalability
- **Monitoring**: OpenTelemetry for distributed tracing
- **Logging**: Centralized logging with Sentry for error tracking

## Security Considerations

### Authentication & Authorization
- JWT-based session management with refresh tokens
- Role-based access control for different user types
- Secure credential storage with hashing where appropriate
- Two-factor authentication for administrative accounts

### Data Protection
- End-to-end encryption for sensitive data
- HTTPS enforcement in all communications
- Regular penetration testing and vulnerability assessments
- Data retention policies compliant with local regulations

### Compliance
- GDPR/CCPA compliance for customer data handling
- PCI-DSS compliance for payment processing
- Regular audits of security controls and procedures

## Scalability Design

### Horizontal Scaling
- Microservice architecture allows independent scaling of components
- Load balancing across multiple instances
- Auto-scaling based on demand metrics
- Database read replicas for analytical queries

### Performance Optimizations
- Cache layers for frequently accessed data
- CDN for static assets and media files
- Database indexing strategies for complex queries
- Asynchronous processing for long-running tasks

### Disaster Recovery
- Multi-region deployment capabilities
- Automated backup and restore procedures
- Cross-zone redundancy for critical services
- Planned maintenance windows with minimal disruption

## Monitoring and Observability

The system includes observability layers for operational monitoring:

- **Metrics Collection**: Prometheus for time-series metrics
- **Logs Aggregation**: Centralized logging system
- **Tracing**: OpenTelemetry for distributed tracing
- **Alerting**: Automated alerts for critical system health
- **APM**: Application performance monitoring