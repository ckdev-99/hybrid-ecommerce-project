# 🚀 Hybrid E-Commerce Development Roadmap

## 📋 Overview

This document outlines the **incremental development approach** for building the hybrid Laravel + NestJS e-commerce platform. Each phase builds upon the previous one, ensuring a solid foundation before moving to the next feature.

---

Level	Role	     Permissions
1	  SuperAdmin   Everything + create admins
2	  Admin	       Products, orders, categories
3	  User	       Browse, cart, checkout

## 🎯 Development Philosophy

> **"Build what you need, when you need it"**

We follow an incremental approach:
- ✅ Create database tables **as needed** for each feature
- ✅ Test each feature before moving to the next
- ✅ Laravel owns the schema (migrations), NestJS maps to existing tables
- ✅ Both services share the same PostgreSQL database

---

## 📊 Phase-by-Phase Development

### ✅ Phase 1: Foundation - Authentication & Users
**Duration:** Completed
**Priority:** 🔴 CRITICAL (must be done first)

**What we built:**
- ✅ User registration & login
- ✅ Role-based access control (SuperAdmin, Admin, User)
- ✅ JWT token authentication via Laravel Sanctum
- ✅ User profile management
- ✅ Role & Permission middleware

#### Database Tables (Phase 1) ✅

| Table | Purpose | Owner |
|-------|---------|-------|
| `users` | User accounts | Laravel |
| `roles` | Role definitions | Laravel |
| `user_roles` | User-role relationships | Laravel |
| `permissions` | Permission definitions | Laravel |
| `role_permissions` | Role-permission relationships | Laravel |
| `personal_access_tokens` | Sanctum JWT tokens | Laravel |

#### Laravel Implementation ✅

```
app/
├── Models/
│   ├── User.php          # HasApiTokens, HasRoles
│   └── Role.php
├── Http/
│   ├── Controllers/
│   │   └── AuthController.php
│   └── Middleware/
│       ├── RoleLevelMiddleware.php
│       └── PermissionMiddleware.php
└── Modules/
    └── Users/
        ├── Routes/users.php
        └── Controllers/UserController.php

routes/api.php
├── POST   /api/register        # ✅ Create user + assign default role
├── POST   /api/login           # ✅ Issue JWT token
├── POST   /api/logout          # ✅ Revoke token
├── GET    /api/me               # ✅ Get current user
├── PUT    /api/me               # ✅ Update profile
└── GET    /api/roles            # ✅ List roles (admin only)
```

#### ✅ Phase 1 Exit Criteria

- [x] Users can register and receive a JWT token
- [x] Users can login with email/password
- [x] SuperAdmin can create Admin accounts
- [x] Role-based middleware works
- [x] Token-based authentication is secured

---

### ✅ Phase 2: Product Catalog (Backend)
**Duration:** Completed
**Priority:** 🟠 HIGH

**What we built:**
- ✅ Category management
- ✅ Product CRUD operations
- ✅ Category-product relationships
- ✅ Protected routes with permission middleware

#### Database Tables (Phase 2) ✅

| Table | Purpose | Owner |
|-------|---------|-------|
| `categories` | Product categories | Laravel |
| `products` | Product catalog | Laravel |

#### Laravel Implementation ✅

```
app/
├── Models/
│   ├── Category.php       # hasMany products
│   └── Product.php         # belongsTo Category
└── Modules/
    ├── Categories/
    │   ├── Routes/categories.php
    │   └── Controllers/CategoryController.php
    └── Products/
        ├── Routes/products.php
        └── Controllers/ProductController.php

routes/api.php
├── GET    /api/categories              # ✅ List categories
├── POST   /api/categories              # ✅ Create (admin)
├── GET    /api/categories/{id}         # ✅ Single category
├── PUT    /api/categories/{id}         # ✅ Update (admin)
├── DELETE /api/categories/{id}         # ✅ Delete (admin)
├── GET    /api/products                # ✅ List products
├── POST   /api/products                # ✅ Create (admin)
├── GET    /api/products/{id}           # ✅ Single product
├── PUT    /api/products/{id}           # ✅ Update (admin)
├── DELETE /api/products/{id}           # ✅ Delete (admin)
└── GET    /api/categories/{id}/products # ✅ Products by category
```

#### ✅ Phase 2 Exit Criteria

- [x] Admins can create categories
- [x] Admins can create products
- [x] Users can browse products by category
- [x] Categories and products are relational
- [x] Permission-based access control works

---

### 🚧 Phase 3: Admin Frontend (Next.js)
**Duration:** Week 3
**Priority:** 🔴 HIGH (current focus)

**What we're building:**
- Admin authentication flow (login/logout)
- Admin dashboard
- Category management UI
- Product management UI
- User & role management UI (SuperAdmin only)

#### Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Styling:** TailwindCSS + shadcn/ui
- **State Management:** React Context / Zustand
- **API Client:** Axios / fetch
- **Authentication:** JWT token storage (httpOnly cookies)

#### Frontend Pages to Build

```
apps/frontend/app/
├── (admin)/
│   ├── login/
│   │   └── page.tsx                    # Admin login
│   ├── dashboard/
│   │   └── page.tsx                    # Admin dashboard home
│   ├── categories/
│   │   ├── page.tsx                    # Categories list
│   │   ├── new/
│   │   │   └── page.tsx                # Create category
│   │   └── [id]/
│   │       ├── page.tsx                # Edit category
│   │       └── delete/page.tsx        # Delete category
│   ├── products/
│   │   ├── page.tsx                    # Products list
│   │   ├── new/
│   │   │   └── page.tsx                # Create product
│   │   └── [id]/
│   │       ├── page.tsx                # Edit product
│   │       └── delete/page.tsx         # Delete product
│   └── users/
│       ├── page.tsx                    # Users list (SuperAdmin only)
│       ├── new/
│       │   └── page.tsx                # Create admin user
│       └── [id]/
│           └── page.tsx                # Edit user / assign roles
├── (auth)/
│   └── layout.tsx                      # Auth provider & middleware
└── layout.tsx                           # Root layout
```

#### Components to Build

```
components/
├── admin/
│   ├── sidebar/
│   │   └── Sidebar.tsx                 # Admin navigation
│   ├── header/
│   │   └── Header.tsx                  # Admin header with logout
│   ├── categories/
│   │   ├── CategoryForm.tsx            # Create/edit form
│   │   └── CategoryList.tsx            # Categories table
│   ├── products/
│   │   ├── ProductForm.tsx             # Create/edit form
│   │   └── ProductList.tsx             # Products table
│   └── users/
│       ├── UserForm.tsx                # Create/edit user
│       └── UserList.tsx                # Users table
└── ui/
    └── [shadcn components]             # Button, Input, Table, etc.
```

#### API Integration Points

```
lib/api/
├── auth.ts
│   ├── login(email, password)          # POST /api/login
│   ├── logout()                         # POST /api/logout
│   └── me()                             # GET /api/me
├── categories.ts
│   ├── getAll()                         # GET /api/categories
│   ├── getOne(id)                       # GET /api/categories/{id}
│   ├── create(data)                     # POST /api/categories
│   ├── update(id, data)                # PUT /api/categories/{id}
│   └── delete(id)                       # DELETE /api/categories/{id}
├── products.ts
│   ├── getAll()                         # GET /api/products
│   ├── getOne(id)                       # GET /api/products/{id}
│   ├── create(data)                     # POST /api/products
│   ├── update(id, data)                # PUT /api/products/{id}
│   └── delete(id)                       # DELETE /api/products/{id}
└── users.ts
    ├── getAll()                         # GET /api/users (SuperAdmin)
    ├── getOne(id)                       # GET /api/users/{id}
    ├── create(data)                     # POST /api/users
    ├── update(id, data)                # PUT /api/users/{id}
    └── delete(id)                       # DELETE /api/users/{id}
```

#### ✅ Phase 3 Exit Criteria

- [ ] Admin login/logout works with JWT
- [ ] Protected admin routes redirect to login if not authenticated
- [ ] Dashboard displays key metrics (total products, categories, users)
- [ ] Categories can be created, edited, and deleted via UI
- [ ] Products can be created, edited, and deleted via UI
- [ ] SuperAdmin can create Admin accounts and manage users
- [ ] Form validation matches backend rules
- [ ] Error handling displays user-friendly messages
- [ ] Responsive design works on tablet/desktop

---

### Phase 4: Shopping Cart (NestJS Service)
**Duration:** Week 4
**Priority:** 🟡 MEDIUM

**What we'll build:**
- Real-time cart management
- Add/remove/update cart items
- Cart persistence across sessions
- Stock validation

#### Database Tables (Phase 4)

| Table | Purpose | Laravel Owner | NestJS Entity |
|-------|---------|---------------|---------------|
| `carts` | Shopping carts | Laravel (migration) | Cart (entity) |
| `cart_items` | Cart line items | Laravel (migration) | CartItem (entity) |

#### Laravel Migrations to Create

```bash
# 1. Carts table
php artisan make:migration create_carts_table

# 2. Cart items table
php artisan make:migration create_cart_items_table
```

#### NestJS Setup

```bash
# Install MikroORM dependencies
cd apps/nestjs-api
pnpm add @mikro-orm/core @mikro-orm/nestjs @mikro-orm/postgresql @mikro-orm/sqlite

# Configure PostgreSQL connection
```

#### NestJS Entities (Map to Laravel Tables)

```
apps/nestjs-api/src/
├── entities/
│   ├── cart.entity.ts       # Maps to carts table
│   └── cart-item.entity.ts   # Maps to cart_items table
├── modules/
│   └── cart/
│       ├── cart.controller.ts
│       ├── cart.service.ts
│       └── cart.module.ts
└── strategies/
    └── jwt.strategy.ts      # Validate Laravel tokens
```

#### API Routes

```
apps/nestjs-api/
├── POST   /api/cart                # Create cart
├── GET    /api/cart                # Get user's cart
├── POST   /api/cart/items          # Add item to cart
├── PUT    /api/cart/items/{id}     # Update quantity
├── DELETE /api/cart/items/{id}      # Remove item
└── DELETE /api/cart                # Clear cart
```

#### ✅ Phase 3 Exit Criteria

- [ ] NestJS connects to PostgreSQL database
- [ ] JWT authentication works cross-service
- [ ] Users can add products to cart
- [ ] Cart items can be updated/removed
- [ ] Stock is validated before adding to cart

---

### Phase 5: Orders & Payments (NestJS Service)
**Duration:** Week 5
**Priority:** 🟢 MEDIUM

**What we build:**
- Order checkout process
- Order management
- Payment integration (Stripe/PayPal)
- Order status tracking
- Order notifications

#### Database Tables (Phase 4)

| Table | Purpose | Laravel Owner | NestJS Entity |
|-------|---------|---------------|---------------|
| `addresses` | Shipping addresses | Laravel (migration) | Address (entity) |
| `orders` | Order headers | Laravel (migration) | Order (entity) |
| `order_items` | Order line items | Laravel (migration) | OrderItem (entity) |
| `order_notifications` | Order status updates | Laravel (migration) | OrderNotification (entity) |

#### Laravel Migrations to Create

```bash
# 1. Addresses table
php artisan make:migration create_addresses_table

# 2. Orders table
php artisan make:migration create_orders_table

# 3. Order items table
php artisan make:migration create_order_items_table

# 4. Order notifications table
php artisan make:migration create_order_notifications_table
```

#### NestJS Modules

```
apps/nestjs-api/src/
├── entities/
│   ├── address.entity.ts
│   ├── order.entity.ts
│   ├── order-item.entity.ts
│   └── order-notification.entity.ts
├── modules/
│   ├── order/
│   │   ├── order.controller.ts
│   │   ├── order.service.ts
│   │   └── order.module.ts
│   ├── payment/
│   │   ├── payment.controller.ts
│   │   ├── payment.service.ts
│   │   └── payment.module.ts
│   └── notification/
│       ├── notification.gateway.ts   # WebSocket
│       └── notification.module.ts
```

#### API Routes

```
apps/nestjs-api/
├── GET    /api/orders                     # List user's orders
├── POST   /api/orders/checkout            # Create order from cart
├── GET    /api/orders/{id}                # Single order details
├── PUT    /api/orders/{id}/status        # Update status (admin)
└── GET    /api/orders/{id}/notifications # Order updates
```

#### ✅ Phase 4 Exit Criteria

- [ ] Cart can be converted to order
- [ ] Payment integration processes transactions
- [ ] Order status updates work
- [ ] Users receive order notifications
- [ ] Admin can view all orders

---

### Phase 6: Customer Frontend (Next.js)
**Duration:** Week 6-7
**Priority:** 🔵 MEDIUM

**What we build:**
- User authentication flow
- Product browsing & search
- Shopping cart interface
- Checkout flow
- Order history

#### Frontend Pages

```
apps/frontend/app/
├── (auth)/
│   ├── login/
│   ├── register/
│   └── page.tsx
├── (shop)/
│   ├── products/
│   │   ├── page.tsx           # Product listing
│   │   └── [id]/page.tsx      # Product details
│   ├── cart/
│   │   └── page.tsx           # Shopping cart
│   └── checkout/
│       └── page.tsx           # Checkout flow
├── (account)/
│   ├── orders/
│   │   ├── page.tsx           # Order history
│   │   └── [id]/page.tsx      # Order details
│   └── profile/
│       └── page.tsx           # User profile
└── (admin)/
    ├── dashboard/
    ├── products/
    └── orders/
```

#### ✅ Phase 5 Exit Criteria

- [ ] Complete auth flow works
- [ ] Products display correctly
- [ ] Cart operations work in real-time
- [ ] Checkout process completes
- [ ] Admin panel functions

---

## 🔐 Role-Based Access Control

### Role Hierarchy

```
SuperAdmin (system owner)
    ├── Can create Admin accounts
    ├── Can manage all settings
    └── Full access to everything

Admin (store manager)
    ├── Can manage products
    ├── Can manage categories
    ├── Can view all orders
    └── Can update order status

User (customer)
    ├── Can browse products
    ├── Can manage cart
    ├── Can checkout
    └── Can view own orders
```

### Middleware Implementation

```php
// Laravel - app/Http/Middleware/RoleMiddleware.php
public function handle($request, Closure $next, $role) {
    if (!$request->user()?->hasRole($role)) {
        return response()->json(['error' => 'Forbidden'], 403);
    }
    return $next($request);
}

// Usage in routes
Route::middleware(['auth:sanctum', 'role:admin'])
    ->group(function () {
        Route::post('/products', [ProductController::class, 'store']);
    });
```

---

## 📝 Migration Naming Convention

When creating migrations, follow this pattern:

```bash
# Format: YYYY_MM_DD_HHMMSS_description_table.php
php artisan make:migration create_{table}_table

# Examples:
php artisan make:migration create_users_table
php artisan make:migration create_roles_table
php artisan make:migration create_products_table
```

---

## 🔄 Cross-Service Communication

### Authentication Flow

```
┌─────────┐                 ┌──────────────┐                ┌──────────┐
│ Next.js │ ──(login)────▶ │   Laravel    │ ──(token)────▶ │  NestJS  │
│ Frontend│                 │   API        │                │   API    │
└─────────┘                 └──────────────┘                └──────────┘
                                   │                               │
                            ┌──────┴──────┐                 ┌──────┴──────┐
                            │ PostgreSQL  │◀───────────────▶│  Validate   │
                            │ Database    │                 │   Token     │
                            └─────────────┘                 └─────────────┘
```

1. User logs in via Laravel → receives JWT token
2. Frontend stores token
3. Frontend sends token with requests to both Laravel and NestJS
4. Both services validate the same token

---

## 🎯 Quick Start: Phase 1 Commands

```bash
# Navigate to Laravel API
cd apps/laravel-api

# Create Phase 1 migrations
php artisan make:migration create_roles_table
php artisan make:migration create_user_roles_table

# Run migrations
php artisan migrate

# Create controllers
php artisan make:controller Auth/AuthController
php artisan make:controller Admin/UserController

# Test the API
php artisan serve --host=0.0.0.0 --port=8000
```

---

## 📚 Next Steps

**Current Status:** 🔨 **Working on Phase 3 - Admin Frontend**

### Completed ✅
- **Phase 1:** Authentication & Users backend (JWT, roles, permissions)
- **Phase 2:** Product Catalog backend (categories, products, CRUD APIs)

### In Progress 🚧
- **Phase 3:** Admin Frontend
  - Next.js project setup
  - Admin authentication flow
  - Dashboard
  - Category management UI
  - Product management UI
  - User management UI

### Upcoming 📋
- **Phase 4:** Shopping Cart (NestJS service)
- **Phase 5:** Orders & Payments (NestJS service)
- **Phase 6:** Customer Frontend

### Immediate Tasks (Phase 3)

1. **Setup Next.js Frontend**
   - Initialize Next.js with TypeScript
   - Configure TailwindCSS + shadcn/ui
   - Setup environment variables for API URLs
   - Configure axios/fetch for API calls

2. **Build Auth Flow**
   - Login page with JWT handling
   - Protected route middleware
   - Logout functionality
   - Token persistence (httpOnly cookies)

3. **Build Admin Layout**
   - Sidebar navigation
   - Header with user info
   - Responsive layout

4. **Build Dashboard**
   - Stats cards (products, categories, users count)
   - Recent activity

5. **Build Category Management**
   - List view with search/filter
   - Create/edit form
   - Delete confirmation

6. **Build Product Management**
   - List view with search/filter
   - Create/edit form
   - Delete confirmation

7. **Build User Management (SuperAdmin only)**
   - List view
   - Create admin user form
   - Role assignment

---

## 🔗 Related Documentation

- [Laravel Sanctum Documentation](https://laravel.com/docs/sanctum)
- [NestJS Microservices](https://docs.nestjs.com/microservices)
- [MikroORM Documentation](https://mikro-orm.io/docs/overview)
- [PostgreSQL with Laravel](https://laravel.com/docs/database)

---

*Last Updated: 2026-07-06*
