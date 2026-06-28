<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent Instructions — Link Shortener Project

This is a **Next.js 16 / React 19** link-shortener application. Coding standards are documented in the `/docs` directory.

> [!CAUTION]
> **MANDATORY: You MUST read the relevant `/docs` instruction file(s) BEFORE writing ANY code.** This is not optional. Generating code without first reading the applicable doc is a violation of these instructions. No exceptions.

## Instruction Files

| File | Domain |
|---|---|
| [docs/auth.md](docs/auth.md) | Authentication (Clerk) |
| [docs/ui.md](docs/ui.md) | UI Components (shadcn/ui) |

**STOP. Before writing a single line of code, identify which domain(s) your task touches and read every corresponding file in the table above in full.** These files are the authoritative source of truth for this project's conventions — your training data is not.

## Quick Reference

- **Path alias**: `@/` maps to the project root — use it everywhere instead of relative imports.
- **`params` / `searchParams` are Promises** in Next.js 16 — always `await` them in layouts and pages.
- **`cn()`** from `@/lib/utils` is the only approved way to merge Tailwind classes.
- **No hand-editing** files inside `components/ui/` — use `npx shadcn add` instead.
- **No `any` types** — use `unknown` and narrow.
- **Server Components by default** — add `"use client"` only when necessary.
- **Dark mode** is always supported — every color class must have a `dark:` counterpart.

