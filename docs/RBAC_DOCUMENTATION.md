# SmartCare RBAC Documentation

## Introduction

Role-Based Access Control (RBAC) ensures that authenticated users can only access endpoints and perform actions allowed by their designated role. SmartCare implements RBAC using a two-tier middleware approach:
1. `authenticate` middleware (verifies JWT identity)
2. `authorize` middleware (verifies role permission)

---

## The Roles

The system uses three strict roles defined in the Prisma Schema (`Role` enum):

- `ADMIN`: System administrators with full access to manage users, doctors, and view analytics.
- `DOCTOR`: Healthcare providers who manage their availability slots, appointments, and profiles.
- `PATIENT`: End-users who can view available doctors and book appointments.

---

## Permission Matrix

| Feature / Resource | PATIENT | DOCTOR | ADMIN |
| :--- | :---: | :---: | :---: |
| **Manage Doctors** | ❌ | ❌ | ✅ |
| **Manage Patients** | ❌ | ❌ | ✅ |
| **Manage All Appts**| ❌ | ❌ | ✅ |
| **Manage All Slots**| ❌ | ❌ | ✅ |
| **Dashboard Analytics**| ❌ | ❌ | ✅ |
| **View All Users** | ❌ | ❌ | ✅ |
| **Update/Delete Users**| ❌ | ❌ | ✅ |
| **View Own Profile**| ✅ | ✅ | N/A |
| **Manage Own Slots**| ❌ | ✅ | N/A |
| **View Own Appts** | ✅ | ✅ | N/A |
| **Update Appt Status**| ❌ | ✅ | ✅ |
| **Book Appts** | ✅ | ❌ | ❌ |
| **Cancel Appts** | ✅ | ✅ | ✅ |
| **Reschedule Appts**| ✅ | ❌ | ❌ |

---

## Implementation Details

### Middlewares

1. **`auth.middleware.ts`**:
   Extracts the Bearer token, verifies it against `JWT_SECRET`, and attaches the decoded payload (including the `role`) to `req.user`.

2. **`role.middleware.ts`**:
   Provides the `authorize(...roles: Role[])` function. It checks if `req.user.role` matches one of the allowed roles passed to the function.

### Reusable Constants

All valid roles and module permissions are defined in `src/config/roles.ts` to ensure consistency.

```typescript
import { Roles, Permissions } from '../config/roles';

// Example array constant for easy access
console.log(Permissions.MANAGE_USERS); // ['ADMIN']
```

---

## How to Protect a Route

To protect a route, you must apply **both** middlewares in sequence.

```typescript
import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/role.middleware';
import { Roles } from '../../config/roles';

const router = Router();

// Only ADMIN can access
router.get('/dashboard', authenticate, authorize(Roles.ADMIN), dashboardController);

// Both DOCTOR and ADMIN can access
router.post('/slots', authenticate, authorize(Roles.DOCTOR, Roles.ADMIN), createSlotController);

// Only PATIENT can access
router.post('/appointments', authenticate, authorize(Roles.PATIENT), bookAppointmentController);
```

---

## Error Responses

The `role.middleware` strictly returns standard JSON structures on failure:

**Unauthorized (Missing/Invalid Token):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

**Forbidden (Valid Token, Wrong Role):**
```json
{
  "success": false,
  "message": "Access denied"
}
```
