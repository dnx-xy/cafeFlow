# Product Requirements Document (PRD): CafeFlow (Cafe-QR)

## 1. Executive Summary

CafeFlow is a comprehensive digital ordering and customer engagement platform designed for small to medium-sized cafes, restaurants, and food businesses. Unlike traditional QR menu solutions, CafeFlow provides a complete business management ecosystem that increases revenue, collects valuable customer data, and drives customer retention through intelligent features like loyalty systems, review boosting, and smart upselling.

## 2. Product Vision & Objectives

### 2.1 Vision Statement
CafeFlow empowers small food and beverage businesses to embrace digital transformation without requiring customers to download any apps. By streamlining the ordering process and collecting rich customer insights, we help businesses increase revenue, build customer relationships, and scale effectively.

### 2.2 Business Objectives
- Increase customer lifetime value for participating businesses
- Enable real-time menu management and availability updates
- Provide actionable analytics to drive business decisions
- Simplify the customer ordering experience
- Support multi-location business expansion

## 3. Target Market & Users

### 3.1 Primary Target Market
- Small cafes (1-10 locations)
- Coffee shops (1-10 locations)
- Food stalls
- Restaurants
- Bakery shops

### 3.2 Secondary Target Market
- Multi-outlet F&B brands
- Franchise businesses

### 3.3 User Personas

#### Business Owner
- **Role**: Manages café operations
- **Goals**: Increase sales, reduce operational costs, understand customer behavior
- **Needs**: Easy menu management, analytics dashboard, loyalty program

#### Customer
- **Role**: Frequent visitor or occasional patron
- **Goals**: Quick ordering, easy payment, enjoy service
- **Needs**: Clear menu, fast ordering, rewards

#### Staff Member
- **Role**: Cashier, waiter, kitchen staff
- **Goals**: Streamlined order processing, real-time updates
- **Needs**: Order notifications, order tracking

## 4. Core Value Proposition

Instead of selling a basic QR menu, CafeFlow sells:
- Increased repeat customers through loyalty and personalization
- Automatic customer database building
- Enhanced Google Reviews through review boosting
- Higher average order value via smart upselling
- Easy digital menu management (categories, images, descriptions)
- No app installation requirement for customers

## 5. Product Features

### 5.1 Digital Menu Management
- Dynamic menu categories
- High-quality menu item images
- Detailed descriptions
- Real-time pricing and availability
- Promotional labels (hot, new, best seller)
- Search functionality
- Mobile-responsive design

### 5.2 QR Per Table System
- Unique QR codes for each physical table
- Table number tracking
- Visit counting mechanism
- Order attribution to tables

### 5.3 Ordering System
- Cart functionality with quantity adjustments
- Customization notes field
- Order delivery types (dine-in, take-away)
- Order confirmation flow
- Order status tracking

### 5.4 WhatsApp Integration
- Automated order generation for WhatsApp
- Order message template with formatted details
- Direct communication channel

### 5.5 Inventory & Availability Management
- Immediate status updates (Available, Sold Out, Hidden)
- Real-time visibility across all channels
- Automated stock tracking

### 5.6 Customer Loyalty Program
- No app required signup
- Points accumulation based on purchases
- Reward redemption
- Tiered membership levels
- Personalized offers

### 5.7 Review Collection & Boosting
- Post-payment rating collection
- Star rating system (1-5 stars)
- Google Review redirection for positive ratings
- Internal feedback collection for negative ratings

### 5.8 Customer Relationship Management
- Customer profile creation
- Purchase history tracking
- Favorite item preferences
- Spending analysis
- Segmentation capabilities

### 5.9 Smart Upselling
- Intelligent product recommendations
- Context-aware suggestions
- Admin-defined upsell rules
- Historical purchase data integration

### 5.10 Analytics Dashboard
- Real-time scan and order metrics
- Conversion rate tracking
- Best-selling items identification
- Revenue trend analysis
- Customer retention metrics
- Average order value calculations
- Peak hour detection

## 6. Technical Requirements

### 6.1 Architecture Overview
Multi-tenant SaaS architecture supporting isolation and scalability.

### 6.2 Data Model Structure
Tenant → Business → Outlet → Tables → Menus → Orders → Customers

### 6.3 Technology Stack
- **Frontend**: Next.js 14+, TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Cache**: Redis
- **Storage**: S3-compatible
- **Realtime**: Socket.IO
- **Auth**: JWT + Refresh Token
- **Payments**: Midtrans
- **Messaging**: WhatsApp API Integration
- **Deployment**: Docker + Kubernetes-ready
- **Monitoring**: OpenTelemetry + Sentry

## 7. Business Model

### 7.1 Pricing Plans
**Free Plan**
- Up to 20 menu items
- Single outlet
- Basic QR menu

**Starter Plan**  
- Unlimited menu items
- QR per table
- Analytics
- Multiple categories

**Pro Plan**
- Customer database
- Loyalty system
- Review booster
- Marketing campaigns

**Enterprise Plan**
- Multi outlet
- Team management
- Advanced analytics
- API access

## 8. User Flows

### 8.1 Customer Journey
1. Customer enters café
2. Scans QR code on table
3. Opens digital menu
4. Browses categories
5. Adds items to cart
6. Submits order
7. Order routed to appropriate system
8. Payment processed
9. Thank-you screen displayed
10. Review collection initiated
11. Loyalty points awarded
12. Customer returns later

### 8.2 Order Processing Flow
- Order submitted from menu
- Route to appropriate destination (waiter, cashier, kitchen, WhatsApp)
- Payment confirmation
- Order completion
- Loyalty points update
- Review request generation

## 9. Non-Functional Requirements

### 9.1 Performance
- Support up to 10,000 concurrent customers
- Response time < 200ms
- 99.9% uptime SLA

### 9.2 Security
- Data encryption at rest and in transit
- GDPR/CCPA compliance
- Role-based access control
- SOC 2 Type II certified (planned)

## 10. Success Metrics

- Customer retention rate improvement
- Average order value growth
- Review collection conversion
- Loyalty program engagement rate
- System uptime and performance