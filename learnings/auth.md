## Authentication Architecture

A **Backend-for-Frontend (BFF)** authentication architecture built with **Next.js + Express**, using **JWT access/refresh tokens** stored in **HTTP-only cookies**.

```text
Browser
    │
    ▼
Next.js Route Handlers (/signin, /signup, /api/*)
    │
    ▼
Express API
```

```text
Protected Request
        │
        ▼
 Next.js Middleware
        │
        ├── Access Token Valid ─────────────► Continue
        │
        └── Access Token Expired
                 │
                 ▼
         Refresh Tokens
                 │
                 ├── Update Browser Cookies
                 ├── Update Current Request Cookies
                 └── Continue
                        │
                        ▼
              Server Components / API Routes
                        │
                        ▼
                   Express Backend
```

### Highlights

- **Centralized authentication**—token validation and refresh are handled once in middleware instead of every component.
- **Server Components always receive fresh credentials**, allowing direct server-to-server requests without retry or refresh logic.
- **JWTs never reach client-side JavaScript**, reducing the attack surface through HTTP-only cookies.
- **Next.js acts as the authentication gateway**, hiding the backend behind a single origin and eliminating CORS-related authentication complexity.
- **Consistent authentication flow** across Server Components, Client Components, Route Handlers, and future Server Actions.

> **Design Note:** V1 intentionally uses **stateless refresh tokens** to keep the authentication layer simple and focused on a clean request lifecycle. Advanced capabilities such as refresh-token rotation, session revocation, and parallel refresh deduplication will be introduced in **V2** using **Redis** or a dedicated **Session** store, without requiring changes to the overall architecture.
