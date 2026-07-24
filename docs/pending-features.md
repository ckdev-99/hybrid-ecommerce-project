# 🚧 Pending Features

This document outlines all pending work organized by feature and priority.

> **Last Updated**: 2026-07-24
> **Current Sprint**: Cart & Checkout System
> **Next Priority**: Customer Profile Pages

---

## 🎯 Feature-Driven Development Strategy

We build **complete features**, not complete layers. Each feature includes:
- Database design
- Backend API
- Admin UI (if applicable)
- Customer UI
- Integration testing

---

## ✅ Sprint 4: Customer Product Experience (COMPLETED)

**Priority**: 🔴 HIGH
**Estimated Time**: Completed in 2-3 days
**Status**: ✅ DONE

### Completed Tasks

- ✅ Customer product listing page at `/products`
- ✅ Product detail page at `/products/[id]`
- ✅ Category listing page at `/categories`
- ✅ Category detail page at `/categories/[slug]`
- ✅ Search functionality at `/search`
- ✅ Customer registration page at `/register`
- ✅ Consistent brand theme applied
- ✅ Landing page with hero section

---

## 🟡 Sprint 5: Customer Identity (PARTIAL)

**Priority**: 🟠 MEDIUM
**Estimated Time**: 1-2 days
**Status**: 🚧 IN PROGRESS

### Completed
- ✅ Customer registration page

### Pending Tasks

#### 1. Customer Profile Page
**Route**: `/profile`
**File**: `apps/frontend/app/profile/page.tsx`

**Requirements:**
- View profile details (name, email)
- Edit name, email
- Change password
- Order history link
- Address management link
- Account stats (orders count, total spent)

**API Calls:**
```typescript
GET /api/auth/me
PUT /api/auth/me
```

**Estimated Time**: 2-3 hours

---

#### 2. Order History Page
**Route**: `/profile/orders`
**File**: `apps/frontend/app/profile/orders/page.tsx`

**Requirements:**
- List all customer orders
- Order status badges
- Order details modal
- Filter by status
- Date range filter

**API Calls:**
```typescript
GET /api/orders  // Need backend implementation
GET /api/orders/{id}
```

**Backend Needed First:**
```php
// OrderController.php - Add customer endpoints
public function index(Request $request) {
    // Return authenticated user's orders
}
```

**Estimated Time**: 4-5 hours (including backend)

---

#### 3. Address Management (PARTIAL)
**Route**: `/profile/addresses`
**File**: `apps/frontend/app/profile/addresses/page.tsx`

**Backend Needed First:**
```php
// Migration needed for addresses table
Schema::create('addresses', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id');
    $table->string('name');
    $table->string('phone');
    $table->string('address_line1');
    $table->string('address_line2')->nullable();
    $table->string('city');
    $table->string('state');
    $table->string('postal_code');
    $table->string('country');
    $table->boolean('is_default')->default(false);
    $table->timestamps();
});
```

**API Endpoints Needed:**
```php
GET    /api/addresses           // List user addresses
POST   /api/addresses           // Create address
PUT    /api/addresses/{id}      // Update address
DELETE /api/addresses/{id}      // Delete address
PUT    /api/addresses/{id}/default  // Set default
```

**Estimated Time**: 5-6 hours (backend + frontend)

---

### Definition of Done - Sprint 5

- [ ] Customers can view profile
- [ ] Customers can update profile
- [ ] Customers can change password
- [ ] Customers can manage addresses
- [ ] Customers can view order history
- [ ] All forms have validation
- [ ] Protected routes work

---

## 🟢 Sprint 6: Cart System

**Priority**: 🔴 HIGH
**Estimated Time**: 3-4 days
**Status**: ⏳ NEXT
**Dependencies**: Products (customer) complete

### Backend Work Required

#### Database Schema
```sql
-- carts table
CREATE TABLE carts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    session_id VARCHAR(255) NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- cart_items table
CREATE TABLE cart_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cart_id BIGINT UNSIGNED,
    product_id BIGINT UNSIGNED,
    quantity INT DEFAULT 1,
    price DECIMAL(10,2),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES carts(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

#### API Endpoints Needed
```php
// CartController.php
GET    /api/cart                    // Get cart (guest or auth)
POST   /api/cart/items              // Add item to cart
PUT    /api/cart/items/{id}         // Update quantity
DELETE /api/cart/items/{id}          // Remove item
DELETE /api/cart                    // Clear cart
POST   /api/cart/merge              // Merge guest cart to user cart
```

### Frontend Work Required

**Pages/Components:**
```
/cart                        // Cart page
/components/cart/CartItem.tsx
/components/cart/CartSummary.tsx
/components/cart/AddToCartButton.tsx
/lib/stores/cartStore.ts      // Zustand cart store
/lib/api/cart.ts              // Cart API functions
```

**Features:**
- Add to cart from product page
- View cart items
- Update quantities
- Remove items
- Cart total calculation
- Guest cart (session-based)
- Cart persistence (localStorage)
- Cart merge on login
- Quantity validation
- Stock check before adding

**Estimated Time**: 16-20 hours (backend + frontend)

---

## 🟢 Sprint 7: Orders & Checkout

**Priority**: 🟠 MEDIUM
**Estimated Time**: 4-5 days
**Status**: ⏳ PENDING
**Dependencies**: Cart, Addresses complete

### Backend Work Required

#### Database Schema
```sql
-- orders table
CREATE TABLE orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED,
    order_number VARCHAR(50) UNIQUE,
    status ENUM('pending','processing','shipped','delivered','cancelled'),
    subtotal DECIMAL(10,2),
    tax DECIMAL(10,2),
    shipping DECIMAL(10,2),
    total DECIMAL(10,2),
    -- Address fields
    shipping_name VARCHAR(255),
    shipping_phone VARCHAR(50),
    shipping_address TEXT,
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(100),
    shipping_postal_code VARCHAR(20),
    shipping_country VARCHAR(100),
    --
    notes TEXT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- order_items table
CREATE TABLE order_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED,
    product_id BIGINT UNSIGNED,
    product_name VARCHAR(255),
    product_sku VARCHAR(100),
    quantity INT,
    price DECIMAL(10,2),
    subtotal DECIMAL(10,2),
    created_at TIMESTAMP
);
```

#### API Endpoints Needed
```php
// Customer
POST   /api/checkout                // Create order from cart
GET    /api/orders                 // My orders
GET    /api/orders/{id}            // Order details

// Admin
GET    /api/admin/orders          // All orders
GET    /api/admin/orders/{id}     // Order details
PUT    /api/admin/orders/{id}/status  // Update status
```

### Frontend Work Required

**Customer Pages:**
```
/checkout                        // Checkout flow
/orders                          // My orders
/orders/[id]                     // Order details
```

**Admin Pages:**
```
/admin/orders                    // Order list
/admin/orders/[id]              // Order details
/admin/orders/[id]/edit         // Update status
```

**Features:**
- Checkout flow (address → shipping → review → confirm)
- Order summary
- Payment integration (Stripe placeholder)
- Order confirmation page
- Order history
- Order detail view
- Order status tracking
- Admin order management
- Order status updates
- Cancel order functionality
- Email notifications (placeholder)

**Estimated Time**: 20-24 hours (backend + frontend)

---

## 🔵 Sprint 8+: Polish & Scale

**Priority**: 🟢 LOW
**Estimated Time**: Ongoing
**Status**: ⏳ PENDING

### Dashboard Analytics
- Real-time sales stats
- Charts and graphs
- Top products
- Recent orders
- Customer metrics

**Estimated Time**: 8-10 hours

---

### Inventory Management
- Stock tracking
- Low stock alerts
- Bulk stock updates
- Stock movement history

**Estimated Time**: 6-8 hours

---

### Reports & Export
- Sales reports
- Customer reports
- Product reports
- Export to CSV/Excel
- Date range filters

**Estimated Time**: 8-10 hours

---

### Coupons & Promotions
- Coupon codes
- Percentage discounts
- Fixed amount discounts
- Free shipping
- Coupon validation
- Usage limits

**Database:**
```sql
CREATE TABLE coupons (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE,
    type ENUM('percentage','fixed','free_shipping'),
    value DECIMAL(10,2),
    min_order_amount DECIMAL(10,2),
    usage_limit INT,
    used INT DEFAULT 0,
    valid_from TIMESTAMP,
    valid_until TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
```

**Estimated Time**: 10-12 hours

---

### Settings & Configuration
- Store settings
- Tax configuration
- Shipping zones
- Payment methods
- Email templates

**Estimated Time**: 8-10 hours

---

## 📊 Timeline Summary

```
Week 1-2:  ✅ Foundation (Auth, Users, Products, Categories)
            Backend + Admin UI + Customer UI complete

Week 3:    ✅ Customer Product Experience (COMPLETED)
            Product listing, detail, categories, search
            Registration, login, theme consistency

Week 4:    🚧 Customer Identity (IN PROGRESS)
            - Profile, Order History, Addresses

Week 5-6:  ⏳ Cart System (NEXT)
            - Backend cart API
            - Cart UI
            - Guest cart

Week 7-8:  ⏳ Orders & Checkout (PENDING)
            - Checkout flow
            - Order management
            - Admin order panel

Week 9+:   ⏳ Polish & Scale (PENDING)
            - Analytics
            - Reports
            - Coupons
            - Settings
```

---

## 🎯 Immediate Next Steps

**Current Focus**: Complete Customer Profile

1. Create `/profile` page with user info
2. Create `/profile/orders` with order history
3. Implement address management backend + frontend

**Next Focus**: Cart System

1. Create backend cart API
2. Implement guest cart (localStorage)
3. Add to cart functionality
4. Cart persistence
5. Cart merge on login

---

## 📝 Development Notes

### API Response Standards

All new APIs should follow this pattern:

```json
{
    "success": true,
    "data": { ... },
    "message": "Operation successful",
    "errors": null
}
```

### Frontend Component Patterns

```tsx
// Page component
export default function Page() {
    return (
        <main>
            <PageHeader />
            <Content />
        </main>
    );
}

// With loading and error states
const { data, loading, error } = useApiCall();
if (loading) return <Loading />;
if (error) return <Error />;
return <Content data={data} />;
```

---

## 🔗 Related Documentation

- **Completed Work**: See [completed-features.md](./completed-features.md)
- **Overall Roadmap**: See [development-roadmap.md](./development-roadmap.md)
- **Project Guide**: See [../CLAUDE.md](../CLAUDE.md)

---

*Last Updated: 2026-07-24*
*Current Focus: Customer Profile & Cart System*
