You are a Senior Product Manager, SaaS Architect, UX Designer, and Staff Full-Stack Engineer.

Help me design a production-ready SaaS product called "CafeFlow" (Cafe-QR).

# Product Vision

CafeFlow is NOT just a QR Menu product.

CafeFlow helps cafes, coffee shops, restaurants, food stalls, and small F&B businesses increase revenue, collect customer data, improve customer retention, and generate more reviews without requiring customers to install an app.

The product should be simple enough for small cafes yet scalable enough for multi-branch businesses.

---

# Core Value Proposition

Instead of selling "QR Menu", we sell:

* Increase repeat customers
* Build customer database automatically
* Generate more Google Reviews
* Increase average order value through upselling
* Easy digital menu management
* No app installation required

---

# Target Market

Primary:

* Small cafes
* Coffee shops
* Food stalls
* Restaurants
* Bakery shops

Secondary:

* Multi-outlet F&B brands
* Franchise businesses

Country:

* Indonesia first
* Expandable globally

---

# Business Model

Free Plan

* Up to 20 menu items
* Single outlet
* Basic QR menu

Starter Plan

* Unlimited menus
* QR per table
* Analytics
* Multiple categories

Pro Plan

* Customer database
* Loyalty system
* Review booster
* Marketing campaigns

Enterprise Plan

* Multi outlet
* Team management
* Advanced analytics
* API access

---

# Customer Flow

Customer enters cafe

↓

Scans QR code on table

↓

Opens digital menu

↓

Browses categories

↓

Adds items to cart

↓

Submits order

↓

Order sent to:

* Waiter
* Cashier
* WhatsApp
* Kitchen queue

↓

Payment

↓

Customer receives thank-you page

↓

Review collection

↓

Loyalty points earned

↓

Customer returns later

---

# MVP Features

## Digital Menu

* Categories
* Product images
* Descriptions
* Prices
* Availability status
* Promo labels
* Search
* Mobile optimized

---

## QR Per Table

Each table has unique QR.

Example:

/menu?table=A01

System tracks:

* Table number
* Visit count
* Orders

---

## Ordering

Customer can:

* Add to cart
* Change quantity
* Add notes
* Submit order

Order should support:

* Dine in
* Take away

---

## WhatsApp Ordering

Initial MVP:

Generate WhatsApp order message.

Example:

Hello.

Table: A05

Order:

* Latte x2
* Croissant x1

Total:
Rp 85.000

---

## Menu Availability

Owner can instantly mark:

* Available
* Sold out
* Hidden

Changes should be real-time.

---

# Differentiating Features

## Loyalty System

No app installation.

Customer enters:

* Name
* WhatsApp number

System tracks:

* Visits
* Purchases
* Points

Examples:

Buy 10 coffees get 1 free.

5 visits = 20% discount.

---

## Review Booster

After payment:

Ask customer:

How was your experience?

Rating:
1-5 stars

If rating >= 4:

Redirect to Google Review.

If rating <= 3:

Collect internal feedback.

---

## Customer CRM

Store:

* Name
* WhatsApp
* Visit history
* Favorite menu
* Spending history

Enable segmentation.

Examples:

Customers who haven't visited in 30 days.

Customers who purchased coffee more than 5 times.

---

## Smart Upselling

Examples:

Customer adds Latte.

Suggest:

* Croissant
* Cheesecake

Customer adds Burger.

Suggest:

* Fries
* Soft drink

Admin can configure upsell rules.

---

## Analytics

Dashboard should show:

* Total scans
* Total orders
* Conversion rate
* Top menu items
* Revenue trends
* Returning customers
* Average order value
* Peak hours

---

# SaaS Requirements

Must support multi-tenancy.

Architecture:

Tenant
→ Business
→ Outlet
→ Tables
→ Menus
→ Orders
→ Customers

Each tenant must have isolated data.

---

# Recommended Tech Stack

Frontend:

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* shadcn/ui
* TanStack Query
* Zustand

Backend:

* NestJS
* TypeScript

Database:

* PostgreSQL

ORM:

* Prisma

Cache:

* Redis

Storage:

* S3 Compatible Storage

Realtime:

* Socket.IO

Authentication:

* JWT
* Refresh Token

Payments:

* Midtrans

Messaging:

* WhatsApp Integration

Deployment:

* Docker
* Kubernetes-ready
* AWS compatible

Monitoring:

* OpenTelemetry
* Sentry

---

# Deliverables

Generate the following:

1. Complete Product Requirements Document (PRD)

2. System Architecture Diagram

3. Multi-Tenant Architecture Design

4. Database Schema

   * Prisma models
   * ERD explanation

5. API Design

   * REST endpoints
   * Authentication
   * Authorization

6. User Roles

   * Super Admin
   * Tenant Owner
   * Manager
   * Staff
   * Customer

7. Admin Dashboard Design

8. Customer UX Flow

9. Security Considerations

10. Scaling Strategy

11. Development Roadmap

Phase 1:
MVP

Phase 2:
Growth

Phase 3:
Enterprise

12. Monetization Strategy

13. Marketing Strategy

14. Competitor Analysis

15. Risks and Mitigation

16. Suggested folder structure for:

* Next.js frontend
* NestJS backend

17. Recommended coding standards

18. CI/CD pipeline design

19. Cost estimation for:

* 100 cafes
* 1,000 cafes
* 10,000 cafes

Output should be detailed, production-ready, and written as if preparing a startup-backed SaaS business.
