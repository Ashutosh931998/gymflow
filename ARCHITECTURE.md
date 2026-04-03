# Gym Flow - Application Architecture

Gym Flow is a modern, responsive Gym Management System built as a high-performance Single Page Application (SPA).

## 1. Tech Stack
- **Frontend Framework:** React 19 (with TypeScript)
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 4
- **Animations:** Motion (Framer Motion)
- **Icons:** Lucide React
- **State Management:** React Hooks (`useState`, `useEffect`, `useMemo`)
- **Persistence:** Custom LocalStorage-based DB Service (Scalable to Backend)

## 2. Component Architecture

### Core Layout
- **App.tsx:** The root component. Manages global state (members, staff, plans, etc.), authentication, and routing (page switching).
- **Sidebar.tsx:** Navigation component with role-based visibility.
- **Login.tsx:** Handles gym registration and staff login.

### Feature Pages
- **Dashboard:** Overview of gym stats, recent activity, and quick check-outs.
- **MembersPage:** CRUD operations for gym members with search and filtering.
- **StaffPage:** Management of staff accounts and roles.
- **PlansPage:** Configuration of membership tiers and pricing.
- **PaymentsPage:** Tracking of member transactions and revenue.
- **ReportsPage:** Data visualization and business analytics.
- **AlertsPage:** Automated notifications for pending payments and expiring memberships.
- **SettingsPage:** Admin-only configuration for role permissions.

### Shared Components
- **Modal.tsx:** A unified form system for adding/editing data.
- **Confirm.tsx:** Reusable confirmation dialogs for destructive actions.
- **Notify.tsx:** Toast notification system for user feedback.

## 3. Data Model

### Member
```typescript
{
  id: string;
  name: string;
  email: string;
  phone: string;
  planId: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
}
```

### Staff / User
```typescript
{
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'trainer' | 'receptionist';
}
```

### Permission System
The application uses a granular Permission Matrix:
- **Admin:** Full access to all features and settings.
- **Trainer/Receptionist:** Access is controlled via the `permissions` state, which defines visible pages and allowed actions (add, edit, delete).

## 4. State & Persistence Flow
1. **Initialization:** On load, `App.tsx` fetches data from `localStorage` via the `DB` service.
2. **Updates:** When a user modifies data (e.g., adds a member), the local React state is updated.
3. **Sync:** A `useEffect` hook triggers a save operation to `localStorage` whenever the state changes.
4. **Security:** Role-based guards (`can` function) prevent unauthorized actions at the UI level.

## 5. Deployment Architecture
- **Build Output:** Static assets (HTML, JS, CSS) generated in the `dist/` folder.
- **Routing:** SPA-friendly routing via `netlify.toml` redirects.
- **Environment:** Designed to run in any static hosting environment (Netlify, Vercel, GitHub Pages).
