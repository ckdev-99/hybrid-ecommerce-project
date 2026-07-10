# Hybrid E-commerce Project - Admin Dashboard

A full-stack e-commerce platform with a Laravel API backend and Next.js 16 frontend, featuring a multi-category store admin panel.

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
- Login page at `/login` with beautiful UI
- Admin layout with sidebar navigation
- Dashboard at `/admin/dashboard` with stats cards and quick actions
- Zustand auth store with persistence
- API client with axios and auth token injection
- shadcn/ui components integrated
- **NEW:** API client functions for products, categories, and users
- **NEW:** Next.js middleware for route protection and role-based access

### 🚧 In Progress / Next Steps

**Priority 1: Complete Admin Pages**
1. Create `/admin/categories/page.tsx` - Categories CRUD
2. Create `/admin/products/page.tsx` - Products CRUD  
3. Create `/admin/users/page.tsx` - Users management (SuperAdmin)
4. Add API client functions for products, categories, users

**Priority 2: Route Protection**
1. Implement Next.js middleware for protected routes
2. Handle auth state and redirects

**Priority 3: Forms & Real Data**
1. Product and category creation/editing forms
2. Connect dashboard stats to real API data
3. Loading states and error handling

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
- `apps/frontend/app/admin/layout.tsx` - Admin layout with sidebar
- `apps/frontend/app/admin/dashboard/page.tsx` - Dashboard

**Libraries:**
- `apps/frontend/lib/store.ts` - Zustand auth store
- `apps/frontend/lib/api/auth.ts` - Auth API functions
- `apps/frontend/lib/api/client.ts` - Axios client setup
- `apps/frontend/lib/api/products.ts` - Products API functions
- `apps/frontend/lib/api/categories.ts` - Categories API functions
- `apps/frontend/lib/api/users.ts` - Users API functions
- `apps/frontend/lib/api/index.ts` - Central API exports
- `apps/frontend/middleware.ts` - Route protection middleware

**Components:**
- `apps/frontend/components/ui/` - shadcn/ui components

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
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
- `POST /api/admin/store/categories` - Create category (admin, level 2+)
- `PUT /api/admin/update/categories/{id}` - Update category (admin, level 2+)
- `DELETE /api/admin/delete/categories/{id}` - Delete category (admin, level 2+)

### Users
- `GET /api/users` - List users (admin)
- `GET /api/users/{id}` - Get user details (admin)

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

### Middleware Protection

The middleware automatically:
- Protects all `/admin/*` routes (requires authentication)
- Redirects unauthenticated users to `/login`
- Redirects authenticated `/login` visitors to `/admin/dashboard`
- Restricts `/admin/users` to SuperAdmin only

No additional configuration needed - just import and use the API functions in your components!

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
- Level 1: Customer
- Level 2: Admin
- Level 3: SuperAdmin

**Protected Routes:**
- All `/admin/*` routes require authentication
- Users page requires SuperAdmin role
- Product and Category management require Level 2+

## Notes

- The login page is at `/login` (not `/admin/login`)
- After successful login, users are redirected to `/admin/dashboard`
- Auth token is stored in Zustand with localStorage persistence
- Axios interceptor automatically adds Bearer token to requests
