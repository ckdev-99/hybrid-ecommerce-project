# CommerceBridge - E-commerce Platform

A full-stack e-commerce platform with a Laravel API backend and Next.js 16 frontend, featuring a multi-category store with admin panel and customer storefront.

## 🏷️ Brand

**Platform Name:** CommerceBridge
**Tagline:** Bridging Commerce to You
**Brand Colors:** Dark Navy theme (#2F354F, #22273A, #282D43)

**Logo Component:** `CommerceBridgeLogo` - Three variants available:
- `icon` - Icon only (for headers)
- `horizontal` - Icon + "CommerceBridge" + "E-commerce Platform"
- `full` - Icon + "CommerceBridge" + "Bridging Commerce to You"

## Architecture

**Monorepo Structure:**
- `apps/laravel-api/` - Laravel 11 backend API
- `apps/frontend/` - Next.js 16 frontend (App Router)

**Tech Stack:**
- Backend: Laravel 11, MySQL, Sanctum auth
- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS, Zustand
- UI Components: shadcn/ui

## Project Status

### ✅ Completed

**Backend (Laravel API):**
- Authentication module (login, register, logout, me)
- Authorization with role-based access control (Admin, SuperAdmin)
- Products module with admin CRUD operations
- Categories module with hierarchy and admin operations
- Users module with profile management
- Middleware for authentication and role-level protection

**Frontend (Next.js):**
- **Branding:** CommerceBridge logo and name across all pages
- **Authentication:** Login page at `/login` with beautiful UI, redirects by role
- **Customer Profile:** `/profile`, `/profile/orders`, `/profile/addresses` pages
- **Admin Layout:** Sidebar navigation with `/admin/dashboard`, Categories, Products, Users
- **Customer Header:** Search, Products, Categories, Cart, User menu
- **Customer Footer:** Shop links, Account links, Contact info
- **Layout System:** ConditionalLayout properly separates customer/admin/auth pages
- **Zustand:** Auth store with persistence and proper cookie handling
- **API Client:** Axios with auth token injection
- **shadcn/ui:** Components integrated with Badge, Button, Card, Input, etc.
- **Route Protection:** Next.js proxy for authentication and role-based access

### 🚧 Future Enhancements

**Potential Improvements:**
1. Add image upload functionality for products and categories
2. Implement bulk actions (delete, activate/deactivate multiple items)
3. Add pagination for large datasets
4. Create advanced filters and sorting options
5. Add export functionality (CSV, Excel)
6. Implement audit logs for tracking changes
7. Add email notifications for important events
8. Complete shopping cart and checkout flow
9. Order management and tracking

## Key Files

### Backend

**Routes:**
- `apps/laravel-api/routes/api.php` - Main API routes
- `apps/laravel-api/app/modules/*/routes/*.php` - Module-specific routes

**Controllers:**
- `apps/laravel-api/app/modules/Auth/Controllers/AuthController.php`
- `apps/laravel-api/app/modules/Products/Controllers/ProductController.php`
- `apps/laravel-api/app/modules/Categories/Controllers/CategoryController.php`
- `apps/laravel-api/app/modules/Users/Controllers/UserController.php`

**Middleware:**
- `apps/laravel-api/app/Http/Middleware/` - Auth and role-level middlewares

### Frontend

**Pages:**
- `apps/frontend/app/login/page.tsx` - Login page
- `apps/frontend/app/register/page.tsx` - Registration page
- `apps/frontend/app/page.tsx` - Landing/home page
- `apps/frontend/app/admin/layout.tsx` - Admin layout with sidebar
- `apps/frontend/app/admin/dashboard/page.tsx` - Dashboard
- `apps/frontend/app/profile/page.tsx` - User profile
- `apps/frontend/app/profile/orders/page.tsx` - Order history
- `apps/frontend/app/profile/addresses/page.tsx` - Address management

**Layout System:**
- `apps/frontend/app/layout.tsx` - Root layout with ConditionalLayout
- `apps/frontend/components/ConditionalLayout.tsx` - Smart layout that renders customer header/footer only on appropriate pages

**Libraries:**
- `apps/frontend/lib/store.ts` - Zustand auth store
- `apps/frontend/lib/api/auth.ts` - Auth API functions
- `apps/frontend/lib/api/client.ts` - Axios client setup
- `apps/frontend/lib/api/products.ts` - Products API functions
- `apps/frontend/lib/api/categories.ts` - Categories API functions
- `apps/frontend/lib/api/users.ts` - Users API functions
- `apps/frontend/proxy.ts` - Route protection proxy (Next.js 16)

**Components:**
- `apps/frontend/components/CommerceBridgeLogo.tsx` - Branded logo component
- `apps/frontend/components/customer/CustomerHeader.tsx` - Customer navigation header
- `apps/frontend/components/customer/CustomerFooter.tsx` - Customer footer
- `apps/frontend/components/ui/` - shadcn/ui components

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout (protected)
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - List all products (public)
- `GET /api/products/{id}` - Get product details (public)
- `POST /api/admin/products` - Create product (admin, level 2+)
- `PUT /api/admin/products/{id}` - Update product (admin, level 2+)
- `DELETE /api/admin/products/{id}` - Delete product (admin, level 2+)

### Categories
- `GET /api/categories` - List categories (public)
- `GET /api/categories/tree` - Get category tree (public)
- `POST /api/admin/categories` - Create category (admin, level 2+)
- `PUT /api/admin/categories/{id}` - Update category (admin, level 2+)
- `DELETE /api/admin/categories/{id}` - Delete category (admin, level 2+)

### Users
- `GET /api/users` - List users (admin)
- `GET /api/users/{id}` - Get user details (admin)
- `PUT /api/admin/users/{id}` - Update user (admin)
- `DELETE /api/admin/users/{id}` - Delete user (SuperAdmin only)

## Environment Variables

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8002
```

**Backend (.env):**
```bash
DB_CONNECTION=mysql
DB_DATABASE=ecommerce_db
# ... other Laravel env vars
```

## Usage Examples

### API Functions

```typescript
import { productsApi, categoriesApi, usersApi } from '@/lib/api';

// Products
const products = await productsApi.getAll();
const product = await productsApi.getById(1);
await productsApi.create({ name: 'New Product', price: 99.99, sku: 'SKU-001' });
await productsApi.update(1, { name: 'Updated Product' });
await productsApi.delete(1);

// Categories
const categories = await categoriesApi.getAll();
const categoryTree = await categoriesApi.getTree();
await categoriesApi.create({ name: 'New Category' });
await categoriesApi.update(1, { name: 'Updated Category' });
await categoriesApi.delete(1);

// Users
const users = await usersApi.getAll();
const user = await usersApi.getById(1);
await usersApi.update(1, { is_active: false });
await usersApi.updateRoles(1, [1, 2]); // Update user roles
```

### Logo Component

```typescript
import { CommerceBridgeLogo } from '@/components/CommerceBridgeLogo';

// Icon only (for headers)
<CommerceBridgeLogo size={40} variant="icon" />

// Horizontal with text
<CommerceBridgeLogo size={40} variant="horizontal" />

// Full layout
<CommerceBridgeLogo size={60} variant="full" />
```

### Layout System

The ConditionalLayout automatically:
- Shows **CustomerHeader + CustomerFooter** on customer pages (home, products, categories, profile, etc.)
- Shows **NO header/footer** on admin pages (admin has its own layout)
- Shows **NO header/footer** on auth pages (login, register - clean, focused pages)

No additional configuration needed - just render your page components normally!

## Development

**Start Backend:**
```bash
cd apps/laravel-api
php artisan serve
```

**Start Frontend:**
```bash
cd apps/frontend
npm run dev
```

## Role-Based Access Control

**Role Levels:**
- Level 1: SuperAdmin (highest access)
- Level 2: Admin
- Level 100: Customer (default)

**Protected Routes:**
- All `/admin/*` routes require authentication
- Users page requires SuperAdmin role
- Product and Category management require Level 2+
- Profile pages require authentication

**Route Protection:**
- The proxy protects routes and redirects unauthenticated users to `/login`
- After login, users are redirected based on their role (Admin → `/admin/dashboard`, Customer → `/`)

## Theme & Brand Colors

```css
/* CommerceBridge Brand Colors */
--brand-primary: #2F354F;      /* Dark Navy - Logo, Buttons, Headers */
--brand-dark: #22273A;         /* Darkest Navy - Backgrounds, Footer */
--brand-gradient: #282D43;     /* Medium Navy - Gradients */
```

**Used In:**
- Customer header background
- Login page right panel
- Admin header background
- Footer background (slightly lighter)
- Buttons and accents

## Notes

- The platform is branded as **CommerceBridge** throughout
- Login page is at `/login` (clean, no header/footer)
- Admin panel is at `/admin/*` (has its own header/sidebar)
- Customer pages have shared header with search, navigation, cart
- Profile pages (`/profile/*`) require authentication
- Logout redirects to `/login` with proper state clearing
- Auth token is stored in Zustand with cookie persistence
- Axios interceptor automatically adds Bearer token to requests
