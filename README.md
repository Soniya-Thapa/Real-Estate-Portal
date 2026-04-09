# Real Estate Portal — Buyer Portal

A full-stack web application for browsing properties and managing favourites. Built with React + TypeScript (frontend) and Node.js + Express + PostgreSQL (backend).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS v4, Vite |
| Backend | Node.js, Express 5, TypeScript |
| Database | PostgreSQL (hosted on Supabase) |
| Auth | JWT (JSON Web Tokens) + bcrypt |

---

## Project Structure

```
real-estate-portal/
├── frontend/          # React app
│   └── src/
│       ├── components/    # Alert, Layout, PropertyCard, ProtectedRoute
│       ├── context/       # AuthContext (JWT state)
│       ├── pages/         # Login, Register, Dashboard, Favourites
│       ├── services/      # Axios API layer
│       └── types/         # Shared TypeScript types
│
└── backend/           # Express API
    └── src/
        ├── config/        # Database connection, schema, seed
        ├── controllers/   # Auth, Property, Favourite logic
        ├── middleware/     # JWT auth middleware
        ├── routes/        # Route definitions
        ├── types/         # TypeScript types
        └── utils/         # Response helpers, validation
```

---

## Prerequisites

- Node.js v18+
- A PostgreSQL database (local or [Supabase](https://supabase.com) free tier)
- npm

---

## Setup & Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd real-estate-portal
```

````markdown
### 2. Backend setup

```bash
cd backend
npm install
```

> Copy `.env.example` to `.env` and fill in your own values:
> ```bash
> cp .env.example .env
> ```

> **Supabase users:** Get your connection string from Project Settings → Database → Connection string (use the "Transaction" pooler URL).
```

### 3. Initialize the database

**If using Supabase (recommended):**
1. Go to your Supabase project → SQL Editor
2. Paste the contents of `src/config/schema.sql` and click **Run**

**If using local PostgreSQL:**
```bash
psql -U postgres -d your_database -f src/config/schema.sql
```

### 4. Seed the database (optional)

Adds sample properties and two test users:

```bash
npm run db:seed
```

Test credentials after seeding:
- **Buyer:** `buyer@example.com` / `SecurePass123`
- **Agent:** `agent@example.com` / `SecurePass123`

### 5. Start the backend

```bash
npm run dev
```

The API will run at `http://localhost:3001`

---

### 6. Frontend setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:3001/api
```

### 7. Start the frontend

```bash
npm run dev
```

The app will open at `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login and get JWT token |
| GET | `/api/auth/me` | Yes | Get current user info |
| GET | `/api/properties` | Yes | List all properties |
| GET | `/api/properties/:id` | Yes | Get a single property |
| GET | `/api/favourites` | Yes | Get my favourites |
| POST | `/api/favourites` | Yes | Add a property to favourites |
| DELETE | `/api/favourites/:propertyId` | Yes | Remove from favourites |
| GET | `/api/favourites/status/:propertyId` | Yes | Check if property is favourited |

---

## Example Flows

### Flow 1: Sign up and browse properties

1. Go to `http://localhost:5173/register`
2. Fill in your name, email, and password (min 8 chars, 1 uppercase, 1 number)
3. You are automatically logged in and redirected to the Dashboard
4. Browse all available properties

### Flow 2: Add a property to favourites

1. Log in at `/login`
2. On the Dashboard, click the heart icon on any property card
3. The heart turns red — the property is now saved to your favourites
4. Click the heart again to remove it

### Flow 3: View your favourites

1. Log in and click **Favourites** in the sidebar
2. All your saved properties are listed here
3. Click the heart on any card to remove it from your favourites — it disappears instantly

### Flow 4: Log out and log back in

1. Click the **Logout** button in the sidebar
2. You are redirected to the Login page
3. Your favourites are preserved — they are stored in the database against your account

---

## Security Notes

- Passwords are hashed using **bcrypt** (never stored as plain text)
- JWT tokens expire after **24 hours**
- All protected routes verify the token server-side on every request
- Favourite operations use the `user_id` from the verified JWT token — users cannot access or modify another user's favourites
- Inputs are sanitized and validated on the backend before hitting the database

---

## Password Requirements

- At least 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number# -Real-Estate-Portal-
