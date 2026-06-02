# Database Schema Design

## Overview

The database schema for CafeFlow is designed to support a multi-tenant architecture with a hierarchical data model. This design enables efficient data management while ensuring complete isolation between tenants.

## Entity Relationship Diagram (ERD)

```
                      Tenant
                        │
          ┌─────────────┴─────────────┐
          │                           │
       Business                   Customer
          │                           │
   ┌──────┴──────┐            ┌─────┴─────┐
   │             │            │           │
Outlet        User         Order    LoyaltyProgram
   │             │            │           │
┌──┴──┐      ┌───┴───┐     ┌──┴──┐    ┌───┴───┐
│     │      │       │     │     │    │       │
Table Menu   Staff   OrderItem  CustomerSegment  PointTransaction
   │     │      │       │     │     │    │       │
   │     │      │       │     │     │    │       │
Category MenuItem  OrderStatus     │     │    │       │
   │     │      │       │     │     │    │       │
   │     │      │       │     │     │    │       │
Promotion   CustomAttribute   │     │    │       │
   │     │      │       │     │     │    │       │
   │     │      │       │     │     │    │       │
MenuGroup  OrderNote   │     │    │       │
   │     │      │       │     │     │    │       │
   │     │      │       │     │     │    │       │
MenuCategory   MenuOption  │     │    │       │
   │     │      │       │     │     │    │       │
   │     │      │       │     │     │    │       │
(MenuItem)  (MenuItem)  │     │    │       │
   │     │      │       │     │     │    │       │
   │     │      │       │     │     │    │       │
   └─────┴──────┴───────┘     └─────┴────┴───────┘
```

## Prisma Models

### Tenant Model
```prisma
model Tenant {
  id                 String    @id @default(cuid())
  name               String
  slug               String    @unique
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
  businesses         Business[]
  customers          Customer[]
  loyaltyPrograms    LoyaltyProgram[]
}
```

### Business Model
```prisma
model Business {
  id              String    @id @default(cuid())
  name            String
  description     String?
  logoUrl         String?
  address         String?
  city            String?
  countryCode     String?
  timezone        String?
  ownerId         String
  tenantId        String
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  outlets         Outlet[]
  users           User[]
  menus           Menu[]
  orders          Order[]
  customers       Customer[]
  loyaltyPrograms LoyaltyProgram[]

  @@index([tenantId])
  @@relation("Businesses")
}
```

### Outlet Model
```prisma
model Outlet {
  id            String    @id @default(cuid())
  name          String
  description   String?
  address       String?
  phoneNumber   String?
  businessId    String
  tenantId      String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  tables        Table[]
  menus         Menu[]
  orders        Order[]
  staffMembers  Staff[]

  @@index([businessId])
  @@index([tenantId])
  @@relation("Outlets")
}
```

### Table Model
```prisma
model Table {
  id           String    @id @default(cuid())
  number       String
  name         String?
  outletId     String
  tenantId     String
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  orders       Order[]
  qrCode       QrCode?

  @@index([outletId])
  @@index([tenantId])
  @@relation("Tables")
}
```

### QrCode Model
```prisma
model QrCode {
  id            String    @id @default(cuid())
  code          String    @unique
  tableId       String
  tenantId      String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  active        Boolean   @default(true)
  usageCount    Int       @default(0)

  @@index([tableId])
  @@index([tenantId])
  @@relation("QrCodes")
}
```

### Menu Model
```prisma
model Menu {
  id              String    @id @default(cuid())
  name            String
  description     String?
  isActive        Boolean   @default(true)
  outletId        String
  tenantId        String
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  categories      MenuCategory[]
  menuGroups      MenuGroup[]
  promotions      Promotion[]

  @@index([outletId])
  @@index([tenantId])
  @@relation("Menus")
}
```

### MenuCategory Model
```prisma
model MenuCategory {
  id              String    @id @default(cuid())
  name            String
  description     String?
  iconUrl         String?
  sortIndex       Int?
  isActive        Boolean   @default(true)
  menuId          String
  tenantId        String
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  menuItems       MenuItem[]

  @@index([menuId])
  @@index([tenantId])
  @@relation("MenuCategories")
}
```

### MenuGroup Model
```prisma
model MenuGroup {
  id              String    @id @default(cuid())
  name            String
  description     String?
  sortIndex       Int?
  isActive        Boolean   @default(true)
  menuId          String
  tenantId        String
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  menuItems       MenuItem[]

  @@index([menuId])
  @@index([tenantId])
  @@relation("MenuGroups")
}
```

### MenuItem Model
```prisma
model MenuItem {
  id                  String    @id @default(cuid())
  name                String
  description         String?
  price               Float
  imageUrl            String?
  available           Boolean   @default(true)
  soldOut             Boolean   @default(false)
  hidden              Boolean   @default(false)
  stockQuantity       Int?
  categorySortIndex   Int?
  groupSortIndex      Int?
  popularityScore     Int       @default(0)
  isFeatured          Boolean   @default(false)
  isSpecialOffer      Boolean   @default(false)
  menuCategoryId      String?
  menuGroupId         String?
  menuId              String
  tenantId            String
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  customAttributes    CustomAttribute[]
  menuOptions         MenuOption[]
  orderItems          OrderItem[]
  promotionItems      PromotionItem[]

  @@index([menuCategoryId])
  @@index([menuGroupId])
  @@index([menuId])
  @@index([tenantId])
  @@relation("MenuItems")
}
```

### CustomAttribute Model
```prisma
model CustomAttribute {
  id          String    @id @default(cuid())
  name        String
  value       String
  menuItemId  String
  tenantId    String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([menuItemId])
  @@index([tenantId])
  @@relation("CustomAttributes")
}
```

### MenuOption Model
```prisma
model MenuOption {
  id              String    @id @default(cuid())
  name            String
  description     String?
  priceAdjustment Float?    // Positive for extra charge, negative for discount
  required        Boolean   @default(false)
  menuItemId      String
  tenantId        String
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  options         MenuOptionValue[]

  @@index([menuItemId])
  @@index([tenantId])
  @@relation("MenuOptions")
}
```

### MenuOptionValue Model
```prisma
model MenuOptionValue {
  id            String    @id @default(cuid())
  name          String
  description   String?
  priceAdjustment Float?  // Adjustment for this specific option
  available     Boolean   @default(true)
  menuOptionId  String
  tenantId      String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([menuOptionId])
  @@index([tenantId])
  @@relation("MenuOptionValues")
}
```

### Promotion Model
```prisma
model Promotion {
  id              String    @id @default(cuid())
  name            String
  description     String?
  type            PromotionType
  startDate       DateTime
  endDate         DateTime
  discountValue   Float     // Could be percentage or fixed amount
  maxDiscount     Float?
  isActive        Boolean   @default(true)
  menuId          String
  tenantId        String
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  promotionItems  PromotionItem[]

  @@index([menuId])
  @@index([tenantId])
  @@relation("Promotions")
}

enum PromotionType {
  PERCENTAGE
  FIXED_AMOUNT
  BUY_X_GET_Y
  FREESHIP
}
```

### PromotionItem Model
```prisma
model PromotionItem {
  id            String    @id @default(cuid())
  menuItemId    String
  promotionId   String
  tenantId      String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([menuItemId])
  @@index([promotionId])
  @@index([tenantId])
  @@relation("PromotionItems")
}
```

### Order Model
```prisma
model Order {
  id                       String    @id @default(cuid())
  orderId                  String    @unique // External reference
  orderIdPrefix            String?
  tableId                  String?
  outletId                 String
  customerId               String?
  userId                   String?
  status                   OrderStatus
  orderType                OrderType
  notes                    String?
  totalAmount              Float
  discountAmount           Float?
  taxAmount                Float?
  finalAmount              Float
  currency                 String    @default("IDR")
  paymentMethod            PaymentMethod?
  paymentStatus            PaymentStatus
  paymentId                String?
  deliveredAt              DateTime?
  completedAt              DateTime?
  cancelledAt              DateTime?
  tenantId                 String
  createdAt                DateTime  @default(now())
  updatedAt                DateTime  @updatedAt
  orderItems               OrderItem[]
  orderNotes               OrderNote[]
  orderStatusUpdates       OrderStatusUpdate[]

  @@index([tableId])
  @@index([outletId])
  @@index([customerId])
  @@index([userId])
  @@index([tenantId])
  @@relation("Orders")
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PREPARING
  READY
  DELIVERED
  COMPLETED
  CANCELLED
}

enum OrderType {
  DINING_IN
  TAKEAWAY
  DELIVERY
}

enum PaymentMethod {
  CASH
  CARD
  QRIS  
  WA_TRANSFER
  BANK_TRANSFER
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}
```

### OrderItem Model
```prisma
model OrderItem {
  id                 String    @id @default(cuid())
  menuItemId         String
  orderId            String
  quantity           Int
  unitPrice          Float
  totalPrice         Float
  notes              String?
  customAttributes   CustomAttributeValue[]
  menuOptions        OrderItemMenuOption[]
  tenantId           String
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt

  @@index([menuItemId])
  @@index([orderId])
  @@index([tenantId])
  @@relation("OrderItems")
}
```

### CustomAttributeValue Model
```prisma
model CustomAttributeValue {
  id            String    @id @default(cuid())
  attributeId   String
  value         String
  orderItemId   String
  tenantId      String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([attributeId])
  @@index([orderItemId])
  @@index([tenantId])
  @@relation("CustomAttributeValues")
}
```

### OrderItemMenuOption Model
```prisma
model OrderItemMenuOption {
  id                 String    @id @default(cuid())
  optionId           String
  optionValueId      String?
  quantity           Int       @default(1) // For multiple selections like "extra cheese"
  priceAdjustment    Float?
  orderItemId        String
  tenantId           String
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt

  @@index([optionId])
  @@index([optionValueId])
  @@index([orderItemId])
  @@index([tenantId])
  @@relation("OrderItemMenuOptions")
}
```

### OrderNote Model
```prisma
model OrderNote {
  id       String    @id @default(cuid())
  orderId  String
  note     String
  tenantId String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([orderId])
  @@index([tenantId])
  @@relation("OrderNotes")
}
```

### OrderStatusUpdate Model
```prisma
model OrderStatusUpdate {
  id        String    @id @default(cuid())
  orderId   String
  status    OrderStatus
  changedBy String?
  tenantId  String
  createdAt DateTime  @default(now())

  @@index([orderId])
  @@index([tenantId])
  @@relation("OrderStatusUpdates")
}
```

### Customer Model
```prisma
model Customer {
  id                    String    @id @default(cuid())
  name                  String
  email                 String?
  phoneNumber           String?
  whatsappNumber        String?
  dateOfBirth           DateTime?
  gender                Gender?
  joinDate              DateTime  @default(now())
  lastVisit             DateTime?
  totalSpent            Float     @default(0)
  visitCount            Int       @default(0)
  favoriteMenuItemId    String?
  tenantId              String
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  orders                Order[]
  segments              CustomerSegmentMember[]
  loyaltyPoints         PointTransaction[]
  customerNotes         CustomerNote[]
  customerFeedback      CustomerFeedback[]

  @@index([tenantId])
  @@unique([phoneNumber, tenantId]) // Phone number is unique within a tenant
  @@relation("Customers")
}

enum Gender {
  MALE
  FEMALE
  OTHER
}
```

### CustomerSegment Model
```prisma
model CustomerSegment {
  id                 String    @id @default(cuid())
  name               String
  description        String?
  criteria           Json      // Dynamic segment conditions
  isActive           Boolean   @default(true)
  tenantId           String
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
  customerMembers    CustomerSegmentMember[]

  @@index([tenantId])
  @@relation("CustomerSegments")
}
```

### CustomerSegmentMember Model
```prisma
model CustomerSegmentMember {
  id             String    @id @default(cuid())
  customerId     String
  segmentId      String
  tenantId       String
  joinedAt       DateTime  @default(now())
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  @@index([customerId])
  @@index([segmentId])
  @@index([tenantId])
  @@relation("CustomerSegmentMembers")
}
```

### CustomerNote Model
```prisma
model CustomerNote {
  id         String    @id @default(cuid())
  customerId String
  note       String
  author     String?
  tenantId   String
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt

  @@index([customerId])
  @@index([tenantId])
  @@relation("CustomerNotes")
}
```

### CustomerFeedback Model
```prisma
model CustomerFeedback {
  id           String    @id @default(cuid())
  customerId   String
  orderId      String?
  rating       Int       // Rating from 1-5
  comment      String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  tenantId     String

  @@index([customerId])
  @@index([orderId])
  @@index([tenantId])
  @@relation("CustomerFeedbacks")
}
```

### LoyaltyProgram Model
```prisma
model LoyaltyProgram {
  id                         String    @id @default(cuid())
  name                       String
  description                String?
  pointsPerRupiah            Float     @default(1) // e.g., 1 point per Rp 1000 spent
  minimumPurchase            Float     @default(0)
  maximumPointsPerOrder      Float?
  isActive                   Boolean   @default(true)
  businessId                 String
  tenantId                   String
  createdAt                  DateTime  @default(now())
  updatedAt                  DateTime  @updatedAt
  pointsTransactions         PointTransaction[]
  loyaltyRewards             LoyaltyReward[]
  loyaltyTierRules           LoyaltyTierRule[]

  @@index([businessId])
  @@index([tenantId])
  @@relation("LoyaltyPrograms")
}
```

### LoyaltyTierRule Model
```prisma
model LoyaltyTierRule {
  id              String    @id @default(cuid())
  name            String
  description     String?
  minPoints       Int
  maxPoints       Int?
  tierLevel       Int       // 1 = Bronze, 2 = Silver, 3 = Gold, etc.
  benefits        Json      // Benefits like discounts, free items, etc.
  loyaltyProgramId String
  tenantId        String
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([loyaltyProgramId])
  @@index([tenantId])
  @@relation("LoyaltyTierRules")
}
```

### LoyaltyReward Model
```prisma
model LoyaltyReward {
  id                String    @id @default(cuid())
  name              String
  description       String?
  pointsRequired    Int
  rewardType        RewardType
  discountValue     Float?    // Percentage for discount or fixed amount
  freeItemMenuId    String?
  isActive          Boolean   @default(true)
  loyaltyProgramId  String
  tenantId          String
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  @@index([loyaltyProgramId])
  @@index([tenantId])
  @@relation("LoyaltyRewards")
}

enum RewardType {
  DISCOUNT
  FREE_ITEM
  VOUCHER
  EXCLUSIVE_ACCESS
}
```

### PointTransaction Model
```prisma
model PointTransaction {
  id                  String    @id @default(cuid())
  customerId          String
  loyaltyProgramId    String
  points              Int
  transactionType     TransactionType
  description         String
  orderId             String?
  referenceId         String?
  tenantId            String
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt

  @@index([customerId])
  @@index([loyaltyProgramId])
  @@index([orderId])
  @@index([tenantId])
  @@relation("PointTransactions")
}

enum TransactionType {
  EARNED
  SPENT
}
```

### User Model
```prisma
model User {
  id           String    @id @default(cuid())
  name         String
  email        String    @unique
  passwordHash String?
  role         UserRole
  isActive     Boolean   @default(true)
  tenantId     String
  businessId   String
  lastLogin    DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  staff        Staff[]
  orders       Order[]
  customer     Customer?

  @@index([tenantId])
  @@index([businessId])
  @@relation("Users")
}

enum UserRole {
  SUPER_ADMIN
  TENANT_OWNER
  MANAGER
  STAFF
  CUSTOMER
}
```

### Staff Model
```prisma
model Staff {
  id         String    @id @default(cuid())
  userId     String
  outletId   String
  roleId     StaffRoleId
  isActive   Boolean   @default(true)
  tenantId   String
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  user       User      @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([outletId])
  @@index([tenantId])
  @@relation("Staffs")
}

enum StaffRoleId {
  ADMIN
  MANAGER
  WAITER
  CHEF
  CASHIER
}
```

## Data Integrity and Relationships

### Foreign Key Constraints
All relationships in the schema enforce referential integrity:
- **Tenant relationships**: All child entities link back to tenant id
- **Hierarchical relationships**: Proper parent-child linkage following the hierarchy
- **Soft-delete patterns**: Active flags rather than physical deletes for auditability

### Indexing Strategy
- **Tenant separation**: All entities indexed by tenantId for tenant isolation
- **Common query paths**: Frequently queried fields receive indexes (tableId, outletId, etc.)
- **Compound keys**: Multi-column indexes for common JOIN operations

### Security Considerations
- **Data isolation**: TenantID is required in all queries for proper isolation
- **Role-based access**: User roles control entity access patterns
- **Audit trail**: All modifications logged with timestamps

## Data Migration and Versioning

### Schema Changes
- **Backward compatibility**: Major schema changes with migration scripts
- **Versioned migrations**: Maintained for rollbacks and rollback strategies  
- **Zero-downtime**: Migrations planned to minimize service interruption

This database schema supports the full CafeFlow functionality while maintaining multi-tenancy, scalability, and data integrity.