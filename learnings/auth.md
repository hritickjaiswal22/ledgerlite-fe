## Auth Architecture Summary

### Chosen Stack

| Layer        | Technology                                 | Responsibility                                     |
| ------------ | ------------------------------------------ | -------------------------------------------------- |
| **Frontend** | Next.js 14+ (App Router)                   | Pages, UI, Client Components                       |
| **Backend**  | Express (separate port)                    | Auth logic, business logic, DB, cookie setter      |
| **State**    | `httpOnly` secure cookies (set by Express) | Token storage (no localStorage, no Server Actions) |

---

### The Flow

**1. Login / Signup**

```
User submits form (Client Component)
    ↓
axios.post('http://localhost:4000/auth/login', credentials, { withCredentials: true })
    ↓
Express validates → sets httpOnly cookies via res.cookie()
    ↓
Client receives 200 → router.push('/dashboard')
```

**2. Authenticated Data Fetching**

```
React Component mounts
    ↓
axios.get('http://localhost:4000/api/...', { withCredentials: true })
    ↓
Browser auto-sends access_token cookie → Express
    ↓
Express validates JWT → returns data
```

**3. Token Refresh**

```
axios interceptor catches 401 from Express
    ↓
axios.get('http://localhost:4000/auth/refresh', { withCredentials: true })
    ↓
Browser auto-sends refresh_token cookie → Express
    ↓
Express validates → sets new access_token cookie (Set-Cookie header)
    ↓
Browser updates cookie store automatically
    ↓
Interceptor retries original request with new cookie
```

**4. Logout**

```
axios.post('http://localhost:4000/auth/logout', {}, { withCredentials: true })
    ↓
Express clears cookies (res.clearCookie) + invalidates refresh token in DB
    ↓
Client receives 204 → router.push('/login')
```

---

### File Structure

```
app/
├── login/
│   └── page.tsx              # Client Component (form + submit handler)
├── signup/
│   └── page.tsx              # Client Component
├── dashboard/
│   └── page.tsx              # Protected page (can be Server or Client)
lib/
├── api.ts                    # Axios instance with 401 interceptor + withCredentials
└── auth.ts                   # Optional: helper hooks for auth state
middleware.ts                 # Route guards only
```

---

And every client request must include:

```typescript
// lib/api.ts
const api = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true, // Required. Sends/receives cookies.
});
```

---

## Why Next.js Middleware?

| Reason                     | Explanation                                                                                  |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| **Instant redirect**       | Blocks unauthenticated users before page renders. No hydration, no API calls, no UI flicker. |
| **Zero latency**           | Runs locally on Next.js server. No network hop to Express.                                   |
| **Cookie existence check** | Reads `access_token` cookie from the request. Does NOT verify JWT — that's Express's job.    |
| **Route guards**           | Keeps logged-in users off `/login` and logged-out users off `/dashboard`.                    |
| **SEO safety**             | Prevents crawlers from indexing protected routes.                                            |

### What It Does NOT Do

- ❌ Verify JWT expiry or signature
- ❌ Call Express for validation
- ❌ Refresh expired tokens
- ❌ Add network hops to API calls

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
}

export const config = {
  matcher: ...,
};
```

---

### ⚠️ One Caveat

Middleware only checks if the cookie **exists**. If the user has an expired `access_token` cookie, middleware will let them through to `/dashboard`, and the page/API calls will hit Express, get a 401, trigger the interceptor, refresh the token, and retry.

This means users with expired tokens see a brief loading state on protected pages rather than being redirected to login. This is the correct behavior — silent refresh is better UX than forcing re-login.
