# User Roles and Permissions

## Overview

This document defines the user roles within CafeFlow and their respective permissions, ensuring proper access control and security throughout the platform. Each role has distinct capabilities based on their responsibilities and the principle of least privilege.

## Role Hierarchy

```
SUPER_ADMIN
    │
    ├─ TENANT_OWNER
    │    │
    │    ├─ MANAGER
    │    │    │
    │    │    ├─ STAFF
    │    │    │
    │    │    └─ CUSTOMER
    │    │
    │    └─ CUSTOMER
    │
    └─ CUSTOMER
```

## Role Definitions and Permissions

### 1. Super Admin

**Description**: Platform administrator with full access to all tenants, features, and system configurations.

**Permissions**:
- Full access to all tenants and their data
- Create and manage tenant accounts
- View and modify system-wide configurations
- Manage billing and subscriptions for all tenants
- Monitor system performance and health
- Approve/disapprove new businesses
- Configure global platform settings
- Access all analytics across the platform
- Manage user accounts at the system level
- Audit and review all tenant activities
- Deploy and manage infrastructure

**Scope**: Global platform administration

### 2. Tenant Owner

**Description**: Business owner or primary administrator responsible for managing their specific tenant's operations.

**Permissions**:
- Access and manage business information for their tenant
- Create and manage outlets within their business
- Manage menu items, categories, and promotions
- Configure tables and QR codes for their locations
- Manage staff members and their roles
- View and manage orders for their tenant
- Access customer database and loyalty programs
- Use analytics dashboard for their business
- Configure loyalty program settings
- Manage marketing campaigns
- Create and manage customer segments
- Handle billing and subscription details for their tenant

**Scope**: Single tenant management

### 3. Manager

**Description**: Operations manager with extensive privileges to manage day-to-day business operations.

**Permissions**:
- Create and update menus, categories, and items
- Manage outlet information and configurations
- Configure tables and QR codes for specific outlet
- Manage staff member accounts and permissions
- View and update orders for assigned outlets
- Process order status changes
- View and manage customer information
- Access analytics dashboard for business
- Manage loyalty program activities
- Create customer segments and targeting
- Initiate marketing campaigns

**Scope**: Business operations within assigned tenant

### 4. Staff

**Description**: Front-line personnel with limited access for order processing and basic management.

**Permissions**:
- View orders assigned to their outlet or table
- Update order status (prepare, deliver, complete)
- Process and confirm orders
- View current menu items
- Access customer profile information (for order processing)
- Receive notifications about new orders
- Update personal profile information

**Scope**: Local operations within assigned outlet

### 5. Customer

**Description**: End-user who places orders and interacts with the platform to access services.

**Permissions**:
- View public menus and availability
- Place orders with table assignment
- View order history
- Review and submit feedback for orders
- Access loyalty program information
- Update personal profile
- View favorite items and order preferences
- Participate in loyalty rewards program

**Scope**: Self-service and order placement

## Permission Matrix

| Feature | Super Admin | Tenant Owner | Manager | Staff | Customer |
|--------|-------------|--------------|---------|-------|----------|
| Access All Tenants | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage Tenant Accounts | ✅ | ❌ | ❌ | ❌ | ❌ |
| Create Business | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage Outlets | ❌ | ✅ | ✅ | ❌ | ❌ |
| Menu Management | ❌ | ✅ | ✅ | ❌ | ❌ |
| Table Configuration | ❌ | ✅ | ✅ | ❌ | ❌ |
| Staff Management | ❌ | ✅ | ✅ | ❌ | ❌ |
| Order Processing | ❌ | ✅ | ✅ | ✅ | ❌ |
| Customer Database | ❌ | ✅ | ✅ | ❌ | ❌ |
| Analytics Dashboard | ❌ | ✅ | ✅ | ❌ | ❌ |
| Loyalty Program | ❌ | ✅ | ✅ | ❌ | ✅ |
| Reviews & Feedback | ❌ | ✅ | ✅ | ❌ | ✅ |
| Marketing Campaigns | ❌ | ✅ | ✅ | ❌ | ❌ |
| Profile Management | ❌ | ✅ | ✅ | ✅ | ✅ |
| Order Placement | ❌ | ❌ | ❌ | ❌ | ✅ |
| Payment Processing | ❌ | ❌ | ❌ | ❌ | ✅ |
| System Configuration | ✅ | ❌ | ❌ | ❌ | ❌ |

## Role Assignment Workflow

### 1. Registration and Role Assignment
When a user registers with the system, they are initially assigned the **CUSTOMER** role automatically.
- New business owners are granted the **Tenant Owner** role upon successful business registration
- Existing users can be promoted by higher-level administrators

### 2. Role Promotion/Demotion Process
- **Promotion**: Requires approval from superior roles (manager to staff, owner to manager)
- **Demotion**: Can be performed by any higher role in the hierarchy
- **Role Changes**: Logged with timestamps and reason in audit trail

### 3. Role Enforcement Mechanisms
- **JWT Claims**: Each token includes role information for runtime authorization
- **Middleware**: API middleware validates role-based access for each request
- **Database Constraints**: Prevent unauthorized modifications
- **Session Management**: Role-dependent access scope during sessions
- **Activity Logs**: All role assignments and changes are logged for compliance

## Access Control Patterns

### 1. Context-Aware Access
Permissions vary based on:
- The specific tenant a user belongs to
- The outlet/area they are authorized to access
- Their assigned role within the organizational hierarchy

### 2. Data Isolation
Each role only accesses data within their defined scope:
- Customers: Only customer data they're authorized to see
- Orders: Orders within their assigned outlet(s)
- Analytics: Only data for their tenant/business
- Staff: Staff within their outlet or business

### 3. Time-Based Restrictions
Certain roles may have:
- Temporary elevated privileges during peak hours
- Scheduled access window restrictions for security
- Limited access during maintenance periods

## Security Considerations

### 1. Role-Based Access Control (RBAC)
- Every action in the system is checked against user role
- Role definitions are enforced through middleware
- Automatic permission validation before processing requests

### 2. Least Privilege Principle
- Users are granted only minimum necessary permissions
- Higher-level roles can always escalate permissions (not vice versa)
- Default restrictions apply even for trusted users

### 3. Session Management
- Sessions contain role-specific claims
- Role changes immediately invalidate active sessions
- Session timeout policies enforced system-wide

## Audit and Compliance

### 1. Audit Trail
All role assignments, changes, and access attempts are logged:
- Timestamps and user details for every interaction
- IP addresses and locations of all activity
- Reason codes for privileged actions

### 2. Compliance Requirements
- GDPR compliance with role-based data access
- Data minimization based on user roles
- Audit capability for regulatory compliance
- Secure handling of personal information by role categories

## Implementation Notes

### 1. Technical Implementation
In the backend system:
- User roles are stored in the `users` table with `role` field
- Middleware checks role permissions before accessing protected routes
- API responses vary based on user role and their access rights
- Database queries include tenantId filters for data isolation

### 2. Frontend Implementation
The frontend:
- Dynamically renders UI elements based on user role
- Shows/hides navigation items according to permissions
- Displays role-appropriate views and functionality
- Provides appropriate error messages for restricted access

### 3. Migration Considerations
Existing systems should:
- Map old user types to new roles appropriately
- Ensure no access privilege loss during role migration
- Retain audit trail of historical role changes