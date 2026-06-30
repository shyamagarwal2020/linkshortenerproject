<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data.
<!-- END:nextjs-agent-rules -->

# Agent Instructions — Link Shortener Project

This is a **Next.js 16 / React 19** link-shortener application.

## Quick Reference

- **NEVER use `middleware.ts`** — it is deprecated in this version of Next.js. Use `proxy.ts` instead for all proxy/middleware logic.
- **Path alias**: `@/` maps to the project root — use it everywhere instead of relative imports.
- **`params` / `searchParams` are Promises** in Next.js 16 — always `await` them in layouts and pages.
- **`cn()`** from `@/lib/utils` is the only approved way to merge Tailwind classes.
- **No hand-editing** files inside `components/ui/` — use `npx shadcn add` instead.
- **No `any` types** — use `unknown` and narrow.
- **Server Components by default** — add `"use client"` only when necessary.
- **Dark mode** is always supported — every color class must have a `dark:` counterpart.
