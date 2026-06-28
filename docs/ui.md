# UI Components — shadcn/ui Only

## Non-Negotiable Rules

- **shadcn/ui is the sole component library.** Never build custom UI components from scratch. Never install or use MUI, Chakra UI, Ant Design, Radix UI directly, Headless UI, or any other component library.
- Every UI element (buttons, inputs, dialogs, cards, badges, tabs, etc.) must come from shadcn/ui.
- If a component you need does not exist in `components/ui/`, add it with `npx shadcn add <name>` — do not hand-roll it.

---

## Adding Components

Always use the CLI to add shadcn components. Never manually create or copy files into `components/ui/`:

```bash
npx shadcn add <component-name>
# examples:
npx shadcn add input
npx shadcn add dialog
npx shadcn add card
npx shadcn add badge
```

This project uses the **`radix-nova`** style (set in `components.json`). The CLI will generate components consistent with that style automatically.

---

## Importing Components

Always import from the `@/components/ui/` alias — never use relative paths:

```tsx
// correct
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

// wrong
import { Button } from '../../components/ui/button'
```

---

## Icons

Icons must come from **`lucide-react`** only (configured in `components.json` as `iconLibrary: "lucide"`). Do not install or use `react-icons`, `heroicons`, `phosphor-icons`, or any other icon set.

```tsx
import { Link, Copy, Trash2 } from 'lucide-react'
```

---

## Styling

- Use **Tailwind CSS utility classes** and the project's CSS variables for all styling.
- Use `cn()` from `@/lib/utils` to merge or conditionally apply classes — it is the only approved method.
- Do not write inline `style={{}}` objects.
- Dark mode must always be supported — every color class needs a `dark:` counterpart.

```tsx
import { cn } from '@/lib/utils'

<div className={cn('rounded-lg p-4 bg-white dark:bg-neutral-900', isActive && 'ring-2 ring-primary')} />
```

---

## Do Not Edit `components/ui/` Files

Files inside `components/ui/` are generated and owned by shadcn. Do not edit them manually — changes will be overwritten on the next `npx shadcn add`. If you need component variants, compose them in a new file outside `components/ui/`.
