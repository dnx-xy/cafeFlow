# API Design Specification

## Overview

This document outlines the REST API design for CafeFlow, covering all major endpoints, authentication, authorization, and data structures. The API follows REST principles and uses JSON for data exchange.

## Base URL
`https://api.cafe-flow.com/v1`

## API Versioning
All endpoints are prefixed with `/v1` for versioning purposes.

## Authentication & Authorization

### Authentication Methods

#### 1. JWT-based Authentication
- **Endpoint**: `POST /auth/login`
- **Headers**: `Authorization: Bearer {token}`
- **Token Expiry**: Access tokens expire after 1 hour, refresh tokens after 7 days

#### 2. Refresh Tokens
- **Endpoint**: `POST /auth/refresh`
- **Purpose**: Extend session life without re-authentication
- **Security**: Refresh tokens are stored with cryptographic hashes and short expiry

### Authorization Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Super Admin** | Full access to all resources across tenants |
| **Tenant Owner** | Access to all resources within their tenant |
| **Manager** | Manage business, outlet, menu, orders, staff |
| **Staff** | View orders, update status, manage own tasks |
| **Customer** | Order placement, review submission, loyalty management |

### Protected Routes Pattern

Routes requiring authentication start with `/protected/`:
```
{
  "auth": {
    "bearer": true,
    "roles": ["TENANT_OWNER", "MANAGER", "STAFF"]
  }
}
```

## API Endpoints

### 1. Authentication Endpoints

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "manager@cafe.com",
  "password": "securePassword123"
}

Response 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "user": {
    "id": "user_abc123",
    "name": "Manager Name",
    "email": "manager@cafe.com",
    "role": "MANAGER"
  }
}
```

#### Refresh Token
```
POST /auth/refresh
Content-Type: application/json
Authorization: Bearer {refresh_token}

{
  "refresh_token": "{refresh_token}"
}

Response 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
```

#### Logout
```
POST /auth/logout
Authorization: Bearer {access_token}

Response 200 OK
{
  "message": "Successfully logged out"
}
```

### 2. Tenant Management

#### Get Current Tenant Info
```
GET /tenants/current
Authorization: Bearer {access_token}

Response 200 OK
{
  "id": "tenant_abc123",
  "name": "Starbucks Jakarta",
  "slug": "starbucks-jakarta",
  "createdAt": "2023-01-15T10:30:00Z"
}
```

#### List Tenants (for Super Admin)
```
GET /tenants
Authorization: Bearer {access_token}
Query Parameters:
- page: int (default: 1)
- limit: int (default: 20)
- name: string (filter by name)

Response 200 OK
{
  "data": [
    {
      "id": "tenant_abc123",
      "name": "Starbucks Jakarta",
      "createdAt": "2023-01-15T10:30:00Z",
      "isActive": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

### 3. Business Management

#### Create Business
```
POST /businesses
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "My Cafe",
  "description": "A great place for coffee",
  "logoUrl": "https://cdn.example.com/logo.png",
  "address": "Jl. Merdeka 123",
  "city": "Jakarta",
  "countryCode": "ID"
}

Response 201 Created
{
  "id": "business_def456",
  "name": "My Cafe",
  "description": "A great place for coffee",
  "address": "Jl. Merdeka 123",
  "city": "Jakarta",
  "countryCode": "ID",
  "createdAt": "2023-06-01T10:30:00Z"
}
```

#### Get Business by ID
```
GET /businesses/{businessId}
Authorization: Bearer {access_token}

Response 200 OK
{
  "id": "business_def456",
  "name": "My Cafe",
  "description": "A great place for coffee",
  "logoUrl": "https://cdn.example.com/logo.png",
  "address": "Jl. Merdeka 123",
  "city": "Jakarta",
  "countryCode": "ID",
  "createdAt": "2023-06-01T10:30:00Z"
}
```

#### Update Business
```
PUT /businesses/{businessId}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "Updated Cafe Name",
  "description": "Updated description",
  "logoUrl": "https://cdn.example.com/new-logo.png"
}

Response 200 OK
{
  "id": "business_def456",
  "name": "Updated Cafe Name",
  "description": "Updated description",
  "logoUrl": "https://cdn.example.com/new-logo.png",
  "address": "Jl. Merdeka 123",
  "city": "Jakarta",
  "countryCode": "ID",
  "updatedAt": "2023-06-01T11:15:00Z"
}
```

### 4. Outlet Management

#### Create Outlet
```
POST /outlets
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "Main Entrance",
  "description": "Main entrance dining area",
  "address": "Jl. Central Street 456",
  "phoneNumber": "021-1234567"
}

Response 201 Created
{
  "id": "outlet_ghi789",
  "name": "Main Entrance",
  "description": "Main entrance dining area",
  "address": "Jl. Central Street 456",
  "phoneNumber": "021-1234567",
  "createdAt": "2023-06-01T10:30:00Z"
}
```

#### List Outlets
```
GET /outlets
Authorization: Bearer {access_token}
Query Parameters:
- businessId: string (filter by business)
- page: int (default: 1)
- limit: int (default: 20)

Response 200 OK
{
  "data": [
    {
      "id": "outlet_ghi789",
      "name": "Main Entrance",
      "description": "Main entrance dining area",
      "address": "Jl. Central Street 456",
      "phoneNumber": "021-1234567",
      "createdAt": "2023-06-01T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

### 5. Menu Management

#### Create Menu
```
POST /menus
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "Daily Specials",
  "description": "Today's special dishes"
}

Response 201 Created
{
  "id": "menu_jkl012",
  "name": "Daily Specials",
  "description": "Today's special dishes",
  "isActive": true,
  "createdAt": "2023-06-01T10:30:00Z"
}
```

#### Get Menu with Items
```
GET /menus/{menuId}?include=categories,items
Authorization: Bearer {access_token}

Response 200 OK
{
  "id": "menu_jkl012",
  "name": "Daily Specials",
  "description": "Today's special dishes",
  "isActive": true,
  "createdAt": "2023-06-01T10:30:00Z",
  "categories": [
    {
      "id": "category_mno345",
      "name": "Coffee",
      "description": "Coffee varieties",
      "items": [
        {
          "id": "item_pqr678",
          "name": "Latte",
          "price": 45000.00,
          "imageUrl": "https://cdn.example.com/latte.png",
          "available": true
        }
      ]
    }
  ]
}
```

### 6. Menu Item Management

#### Create Menu Item
```
POST /menu-items
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "Cappuccino",
  "price": 40000.00,
  "description": "Our signature cappuccino",
  "categoryId": "category_mno345",
  "imageUrl": "https://cdn.example.com/cappuccino.png",
  "available": true
}

Response 201 Created
{
  "id": "item_stu901",
  "name": "Cappuccino",
  "price": 40000.00,
  "description": "Our signature cappuccino",
  "categoryId": "category_mno345",
  "imageUrl": "https://cdn.example.com/cappuccino.png",
  "available": true,
  "createdAt": "2023-06-01T10:30:00Z"
}
```

#### Update Menu Item
```
PUT /menu-items/{itemId}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "Cappuccino Extra",
  "price": 42000.00,
  "available": false
}

Response 200 OK
{
  "id": "item_stu901",
  "name": "Cappuccino Extra",
  "price": 42000.00,
  "description": "Our signature cappuccino",
  "categoryId": "category_mno345",
  "imageUrl": "https://cdn.example.com/cappuccino.png",
  "available": false,
  "updatedAt": "2023-06-01T11:15:00Z"
}
```

### 7. Table Management

#### Create Table
```
POST /tables
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "number": "A01",
  "name": "Table 1",
  "outletId": "outlet_ghi789"
}

Response 201 Created
{
  "id": "table_vwx234",
  "number": "A01",
  "name": "Table 1",
  "outletId": "outlet_ghi789",
  "createdAt": "2023-06-01T10:30:00Z",
  "qrCode": {
    "id": "qrcode_yza567",
    "code": "cf-001-a01",
    "active": true
  }
}
```

#### Get Tables Count by Outlet
```
GET /tables/count?outletId={outletId}
Authorization: Bearer {access_token}

Response 200 OK
{
  "count": 25,
  "active": 18,
  "inactive": 7
}
```

### 8. Order Management

#### Place Order
```
POST /orders
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "outletId": "outlet_ghi789",
  "tableId": "table_vwx234",
  "orderType": "DINING_IN",
  "items": [
    {
      "itemId": "item_stu901",
      "quantity": 2,
      "notes": "Extra milk"
    }
  ],
  "customerInfo": {
    "name": "John Doe",
    "phoneNumber": "+6281234567890",
    "whatsappNumber": "+6281234567890"
  }
}

Response 201 Created
{
  "id": "order_abc123",
  "orderId": "ORD-2023-001",
  "status": "PENDING",
  "totalAmount": 84000.00,
  "orderType": "DINING_IN",
  "tableNumber": "A01",
  "createdAt": "2023-06-01T10:30:00Z"
}
```

#### Get Order Details
```
GET /orders/{orderId}
Authorization: Bearer {access_token}

Response 200 OK
{
  "id": "order_abc123",
  "orderId": "ORD-2023-001",
  "status": "PENDING",
  "totalAmount": 84000.00,
  "orderType": "DINING_IN",
  "tableNumber": "A01",
  "items": [
    {
      "id": "order_item_def456",
      "itemName": "Cappuccino Extra",
      "quantity": 2,
      "unitPrice": 42000.00,
      "totalPrice": 84000.00
    }
  ],
  "paymentStatus": "PENDING",
  "createdAt": "2023-06-01T10:30:00Z"
}
```

#### Update Order Status
```
PUT /orders/{orderId}/status
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "status": "CONFIRMED"
}

Response 200 OK
{
  "id": "order_abc123",
  "status": "CONFIRMED",
  "updatedAt": "2023-06-01T10:45:00Z"
}
```

#### List Orders
```
GET /orders
Authorization: Bearer {access_token}
Query Parameters:
- outletId: string (filter by outlet)
- status: string (filter by status)
- orderType: string (filter by order type)
- startDate: datetime (filter by date range)
- endDate: datetime (filter by date range)
- page: int (default: 1)
- limit: int (default: 20)

Response 200 OK
{
  "data": [
    {
      "id": "order_abc123",
      "orderId": "ORD-2023-001",
      "status": "PENDING",
      "totalAmount": 84000.00,
      "orderType": "DINING_IN",
      "tableNumber": "A01",
      "createdAt": "2023-06-01T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15
  }
}
```

### 9. Customer Management

#### Get Customer Profile (as Customer)
```
GET /customers/me
Authorization: Bearer {access_token}

Response 200 OK
{
  "id": "customer_ijk567",
  "name": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "+6281234567890",
  "whatsappNumber": "+6281234567890",
  "joinDate": "2023-05-15T10:30:00Z",
  "loyaltyPoints": 250,
  "visitCount": 12,
  "favoriteMenuItemId": "item_stu901"
}
```

#### Update Customer Information
```
PUT /customers/me
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "whatsappNumber": "+6281234567891",
  "gender": "MALE"
}

Response 200 OK
{
  "id": "customer_ijk567",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+6281234567890",
  "whatsappNumber": "+6281234567891",
  "gender": "MALE",
  "updatedAt": "2023-06-01T10:30:00Z"
}
```

### 10. Loyalty Program

#### Get Loyalty Program Details (as Business Owner)
```
GET /loyalty-programs
Authorization: Bearer {access_token}

Response 200 OK
{
  "id": "lp_mno890",
  "name": "Gold Rewards",
  "pointsPerRupiah": 1,
  "minimumPurchase": 0,
  "active": true,
  "tierRules": [
    {
      "id": "tier_abc123",
      "name": "Bronze",
      "minPoints": 0,
      "maxPoints": 999,
      "benefits": {
        "discount": 0
      }
    },
    {
      "id": "tier_def456",
      "name": "Silver",
      "minPoints": 1000,
      "maxPoints": 2999,
      "benefits": {
        "discount": 5
      }
    }
  ]
}
```

#### Earn Points for Order
```
POST /loyalty/transactions
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "customerId": "customer_ijk567",
  "orderId": "order_abc123",
  "points": 84,
  "transactionType": "EARNED",
  "description": "Order #ORD-2023-001"
}

Response 201 Created
{
  "id": "pt_ghi789",
  "customerId": "customer_ijk567",
  "orderId": "order_abc123",
  "points": 84,
  "transactionType": "EARNED",
  "description": "Order #ORD-2023-001",
  "createdAt": "2023-06-01T10:30:00Z",
  "currentPoints": 334
}
```

### 11. Reviews

#### Submit Review & Feedback
```
POST /reviews
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "orderId": "order_abc123",
  "customerFeedback": {
    "rating": 5,
    "comment": "Great experience!"
  },
  "customer": {
    "name": "John Doe",
    "whatsappNumber": "+6281234567890"
  }
}

Response 201 Created
{
  "id": "feedback_abc123",
  "orderId": "order_abc123",
  "rating": 5,
  "comment": "Great experience!",
  "createdAt": "2023-06-01T10:30:00Z"
}
```

### 12. Analytics

#### Get Dashboard Summary
```
GET /analytics/dashboard
Authorization: Bearer {access_token}
Query Parameters:
- startDate: string (ISO 8601 format)
- endDate: string (ISO 8601 format)

Response 200 OK
{
  "totalOrders": 125,
  "totalRevenue": 5240000.00,
  "conversionRate": 12.5,
  "avgOrderValue": 41920.00,
  "topItems": [
    {
      "name": "Latte",
      "sales": 34
    }
  ]
}
```

### 13. Staff Management

#### Create Staff Member
```
POST /staff
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@cafe.com",
  "role": "WAITER",
  "outletId": "outlet_ghi789"
}

Response 201 Created
{
  "id": "staff_def456",
  "name": "Jane Smith",
  "email": "jane@cafe.com",
  "role": "WAITER",
  "active": true,
  "createdAt": "2023-06-01T10:30:00Z"
}
```

## Data Structures

### Common Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

## Rate Limiting

- **Standard Rate**: 100 requests per minute per IP address
- **Authorized Users**: 1000 requests per minute per authenticated user
- **Throttling**: Exceeded limits result in HTTP 429 Too Many Requests

## Pagination

All list endpoints support pagination:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 20 | Number of items per page |
| sortBy | string | createdAt | Field to sort by |
| sortOrder | string | desc | Sort order (asc/desc) |

## Webhooks

### Supported Events

| Event Name | Description |
|------------|-------------|
| `order.created` | New order placed |
| `order.status.changed` | Order status updated |
| `customer.joined` | New customer registered |
| `loyalty.points.earned` | Points earned for purchase |

## Security Considerations

### Input Sanitization
- All inputs are validated and sanitized
- SQL injection prevention through prepared statements
- XSS protection with input/output encoding

### HTTPS Enforcement
- All API endpoints require HTTPS
- HSTS headers enabled for security

### CORS Policy
- Configured CORS for whitelisted domains
- Proper preflight request handling

### Data Transmission
- All sensitive data encrypted in transit
- JWT tokens are secured with proper headers

This API design ensures secure, scalable, and maintainable access to all CafeFlow features.