---
description: Read this before implementing or modifying server actions in the project.
---

# Server Actions

## Non-Negotiable Rules

- **All data mutations must use server actions.** Never mutate data directly from a Server Component, API route, or any other pattern.
- **Server actions must be called from Client Components only.** Add `"use client"` to any component that calls a server action.
- **Server action files must be named `actions.ts`** and colocated in the same directory as the Client Component that calls them.
- **Never use the `FormData` TypeScript type** for server action parameters. Define explicit TypeScript types or interfaces for all inputs.
- **All input data must be validated with Zod** before any further processing inside a server action.
- **Every server action must verify a logged-in user first** before performing any database operations. Use Clerk's `auth()` helper and throw or return early if no user is found.
- **Never call Drizzle queries directly inside a server action.** All database operations must go through helper functions located in the `/data` directory.
- **Never throw errors from a server action.** Instead, always return an object with either a `{ error: string }` or `{ success: true }` (and any additional data) shape so callers can handle failures gracefully without unhandled exceptions.

---

## File & Colocation Convention

```
app/
  dashboard/
    _components/
      create-link-form.tsx   ← "use client" component
      actions.ts             ← server action colocated here
```

The `actions.ts` file must begin with `"use server"` at the top.

---

## Anatomy of a Server Action

```ts
"use server"

import { auth } from "@clerk/nextjs/server"
import { z } from "zod"
import { createLink } from "@/data/links"

const CreateLinkSchema = z.object({
  url: z.string().url(),
  slug: z.string().min(1).max(50),
})

type CreateLinkInput = z.infer<typeof CreateLinkSchema>

export async function createLinkAction(input: CreateLinkInput) {
  // 1. Auth check — always first
  const { userId } = await auth()
  if (!userId) return { error: "Unauthorized" }

  // 2. Validate input with Zod
  const parsed = CreateLinkSchema.safeParse(input)
  if (!parsed.success) return { error: "Invalid input" }

  // 3. Delegate to /data helper — never use drizzle directly here
  await createLink({ ...parsed.data, userId })

  return { success: true }
}
```

---

## Checklist

- [ ] File is named `actions.ts` and colocated with its calling component
- [ ] File starts with `"use server"`
- [ ] Calling component has `"use client"`
- [ ] Input parameter uses an explicit TypeScript type (not `FormData`)
- [ ] Input is validated with Zod before use
- [ ] `auth()` is called and `userId` is checked before any DB operation
- [ ] No Drizzle queries inside the action — only `/data` helper functions
- [ ] Action never throws — returns `{ error: string }` on failure and `{ success: true }` on success
