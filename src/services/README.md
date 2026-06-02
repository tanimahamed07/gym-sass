# Services Directory

All API service functions are organized here using functional programming patterns.

## Structure

```
src/services/
├── api.config.ts           # API URL and token management
├── http.service.ts         # Generic HTTP request functions
├── auth.service.ts         # Authentication API calls
├── member.service.ts       # Member management API calls
├── class.service.ts        # Class management API calls
├── trainer.service.ts      # Trainer management API calls
├── plan.service.ts         # Membership plan API calls
├── payment.service.ts      # Payment processing API calls
├── attendance.service.ts   # Attendance tracking API calls
├── announcement.service.ts # Announcement API calls
└── index.ts               # Exports all services
```

## Usage Examples

### Authentication

```typescript
import { authService } from "@/src/services";

// Login
const response = await authService.login({ email, password });

// Register
const response = await authService.register(userData);

// Logout
await authService.logout();
```

### Members

```typescript
import { memberService } from "@/src/services";

// Get all members
const members = await memberService.getMembers();

// Create member
const member = await memberService.createMember(data);
```

### Classes

```typescript
import { classService } from "@/src/services";

// Get all classes
const classes = await classService.getClasses();

// Create class
const gymClass = await classService.createClass(data);
```

## Token Management

Access tokens are stored in memory and automatically attached to all API requests.
Refresh tokens are stored in localStorage.

```typescript
import {
  setAccessToken,
  getAccessToken,
  clearAccessToken,
} from "@/src/services";

// Set token
setAccessToken("your-token");

// Get token
const token = getAccessToken();

// Clear token
clearAccessToken();
```
