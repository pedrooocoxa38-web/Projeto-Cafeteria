# Copilot & AI Agent Instructions for geekhaven-brew-main

## Project Overview
- **Full-Stack:** React/TypeScript frontend + Python/FastAPI backend
- **Frontend:** Vite + React + TypeScript + Tailwind CSS + shadcn-ui
- **Backend:** FastAPI + SQLAlchemy + SQLite + JWT Auth
- **Purpose:** Modern, responsive web app for a geek-themed café, featuring product listings, reservations, shopping cart, and order management.

## Architecture

### Frontend Structure
- **`src/pages/`** — Top-level route components (e.g., `Index.tsx`, `Products.tsx`, `Cart.tsx`)
- **`src/components/`** — Shared UI and feature components
- **`src/components/ui/`** — Atomic UI primitives (shadcn-ui, Radix)
- **`src/hooks/`** — Custom React hooks
- **`src/lib/`** — Utility functions

### Backend Structure
- **`backend/app.py`** — FastAPI application entry point
- **`backend/database.py`** — SQLAlchemy configuration and session management
- **`backend/models/`** — ORM models (User, Product, Order, Cart, Reservation)
- **`backend/routes/`** — API endpoints organized by domain
- **`backend/schemas/`** — Pydantic models for request/response validation
- **`backend/utils/`** — Authentication helpers (JWT, bcrypt)

## Developer Workflows

### Frontend
- **Install:** `npm i`
- **Dev Server:** `npm run dev` (runs on port 5173)
- **Build:** `npm run build`
- **Lint:** `npm run lint`

### Backend
- **Quick Start:** `cd backend && .\start.ps1`
- **Manual Setup:**
  ```powershell
  cd backend
  python -m venv venv
  .\venv\Scripts\Activate.ps1
  pip install -r requirements.txt
  python seed.py
  uvicorn app:app --reload
  ```
- **API Docs:** http://localhost:8000/docs
- **Test Endpoint:** http://localhost:8000/api/test

## Conventions & Patterns

### Frontend
- **Absolute Imports:** Use `@/` alias for `src/` (see `tsconfig.json`)
- **Component Structure:** Functional components, colocate styles, UI logic in `components/ui/`
- **UI Patterns:** Use shadcn-ui/Radix primitives; avoid custom HTML
- **Naming:** PascalCase for components, camelCase for functions/variables
- **State Management:** Use hooks and context; `use-toast` for notifications

### Backend
- **API Structure:** RESTful endpoints organized by domain (auth, products, cart, orders, reservations)
- **Authentication:** JWT tokens via `Authorization: Bearer <token>` header
- **Validation:** Pydantic schemas for all request/response bodies
- **Error Handling:** HTTP status codes with descriptive JSON messages
- **Database:** SQLAlchemy ORM with SQLite; models use relationship declarations

## API Integration

### Authentication Flow
1. User logs in via `POST /api/auth/login` with email/password
2. Backend returns JWT token
3. Store token in localStorage
4. Include token in subsequent requests: `Authorization: Bearer <token>`

### Key Endpoints
- **Products:** `GET /api/products` (public), `POST /api/products` (admin)
- **Cart:** `POST /api/cart/add`, `POST /api/cart/checkout` (authenticated)
- **Reservations:** `POST /api/reservations`, `GET /api/reservations/user/{id}` (authenticated)
- **Orders:** `GET /api/orders/user/{id}`, `PUT /api/orders/{id}/status` (admin)

### Example Fetch
```typescript
const response = await fetch('http://localhost:8000/api/products');
const products = await response.json();
```

See `backend/FRONTEND_EXAMPLES.md` for complete integration examples.

## Key Files

### Frontend
- **`src/pages/Index.tsx`** — Homepage with featured products
- **`src/components/ProductCard.tsx`** — Reusable product display component
- **`src/lib/utils.ts`** — Utility functions (e.g., `cn` for classnames)

### Backend
- **`backend/app.py`** — CORS setup, route registration, startup events
- **`backend/routes/auth.py`** — Login, register, profile endpoints
- **`backend/routes/products.py`** — Product CRUD with admin checks
- **`backend/routes/cart.py`** — Cart management and checkout logic
- **`backend/seed.py`** — Database seeding with test data

## Testing & Debugging

### Backend
- Use Swagger UI at http://localhost:8000/docs to test endpoints interactively
- Check logs in terminal for request/response details
- Credentials (after seed): `admin@geekhaven.com/admin123`, `user@test.com/123456`

### Frontend
- Use browser DevTools to inspect network requests
- Check console for errors
- Use `use-toast` for user feedback

## Common Tasks

### Add a New API Endpoint
1. Create route function in appropriate `backend/routes/*.py`
2. Define Pydantic schemas in `backend/schemas/__init__.py`
3. Register router in `backend/app.py` if new file
4. Test via Swagger UI

### Connect Frontend to New Endpoint
1. Add function to `src/lib/api.ts` (or create this file)
2. Call from component using `fetch` or `axios`
3. Handle loading/error states with `useState`
4. Show feedback via `use-toast`

### Reset Database
```powershell
cd backend
Remove-Item cafeteria.db
python seed.py
```

---

For detailed backend documentation, see `backend/README.md` and `backend/INSTRUCOES_FINAIS.md`.
