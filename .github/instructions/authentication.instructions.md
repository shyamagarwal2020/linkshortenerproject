---
description: Read this before implementing or modifying authentication in the project.
---

# Authentication — Clerk Only

## Non-Negotiable Rules

- **Clerk is the sole auth solution.** Never use `next-auth`, `iron-session`, custom JWTs, cookies for sessions, or any other auth library or pattern. If an auth need arises that isn't covered below, solve it with Clerk APIs — do not introduce alternatives.
- The app already has `@clerk/nextjs` and `@clerk/ui` installed. Do not install other auth packages.
- `<ClerkProvider>` already wraps the app in `app/layout.tsx`. Do not add another provider or move it.

---

## Protected Routes — /dashboard

`/dashboard` (and all routes under `/dashboard/**`) must require an authenticated user.

Enforce this in `proxy.ts` (the middleware file) using `createRouteMatcher`:

```ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/dashboard'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/__clerk/:path*',
    '/(api|trpc)(.*)',
  ],
}
```

`auth.protect()` automatically redirects unauthenticated users to sign in. Do not replicate this guard in individual page or layout files — the middleware is the single enforcement point.

---

## Homepage Redirect for Signed-In Users

If an authenticated user visits `/` (the homepage), they must be redirected to `/dashboard`.

Handle this in `proxy.ts` alongside the protected-route logic:

```ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/dashboard'])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  // Redirect signed-in users away from the homepage
  if (userId && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Protect the dashboard
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})
```

Do not implement this redirect in `app/page.tsx` or `app/layout.tsx`; the middleware is the correct location.

---

## Sign In & Sign Up — Modal Only

Sign in and sign up must **always** open as a modal overlay. Never navigate to a standalone `/sign-in` or `/sign-up` page.

Use the Clerk component `mode` prop:

```tsx
import { SignInButton, SignUpButton } from '@clerk/nextjs'

<SignInButton mode="modal">
  <button>Sign in</button>
</SignInButton>

<SignUpButton mode="modal">
  <button>Sign up</button>
</SignUpButton>
```

- Do **not** create `app/sign-in/` or `app/sign-up/` route folders.
- Do **not** set `NEXT_PUBLIC_CLERK_SIGN_IN_URL` or `NEXT_PUBLIC_CLERK_SIGN_UP_URL` env vars pointing to custom routes.
- Do **not** render `<SignIn />` or `<SignUp />` as full-page components.

The existing header in `app/layout.tsx` already uses `SignInButton` and `SignUpButton` — keep `mode="modal"` on any new or modified instances.

---

## Reading Auth State

| Context | API |
|---|---|
| Server Component / Route Handler | `import { auth } from '@clerk/nextjs/server'` then `const { userId } = await auth()` |
| Client Component | `import { useAuth } from '@clerk/nextjs'` then `const { userId, isSignedIn } = useAuth()` |
| Showing UI conditionally | `<SignedIn>` / `<SignedOut>` wrapper components from `@clerk/nextjs` |

Never pass auth state as props through the component tree — read it directly where needed.
