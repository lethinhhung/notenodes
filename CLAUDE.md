# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

This project uses **pnpm** as the package manager.

- **Development**: `pnpm dev` (uses Turbopack for faster builds)
- **Production build**: `pnpm build` (uses Turbopack)
- **Start production server**: `pnpm start`
- **Lint**: `pnpm lint`
- **Add shadcn/ui components**: `pnpm dlx shadcn@latest add <component-name>`

## Architecture

### Tech Stack

- **Framework**: Next.js 15 (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS v4 with shadcn/ui components (New York style)
- **Internationalization**: react-i18next with server-side support (en, vi)
- **Theme**: next-themes (dark/light mode)
- **Editor**: Lexical (rich text editor)

### Routing and i18n

All routes are locale-prefixed via `app/[locale]/` dynamic segment. Middleware (`middleware.ts`) handles:
- Automatic locale detection from cookies or Accept-Language header
- Redirects to locale-prefixed URLs if missing
- Cookie persistence for selected locale

**Server Components** (default in App Router):
```tsx
import { useTranslation } from "@/lib/i18n"

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const { t } = await useTranslation(locale)
  // Use t('key') for translations
}
```

**Client Components**:
```tsx
"use client"
import { useTranslation } from "@/lib/i18n/client"

export default function Component({ locale }: { locale: string }) {
  const { t } = useTranslation(locale)
  // Use t('key') for translations
}
```

Translation files are located in `lib/i18n/locales/{locale}/translation.json`.

### Fonts

Geist Sans and Geist Mono are loaded conditionally in layout. Vietnamese locale (`vi`) intentionally excludes these fonts (see `app/[locale]/layout.tsx:34`).

### Components

- **shadcn/ui**: Pre-configured with `@/components` alias, New York style, neutral base color
- **Custom components**: `mode-toggle.tsx` (theme switcher), `language-toggle.tsx` (locale switcher), `editor.tsx` (Lexical editor)
- **Theme Provider**: Wraps app in layout for dark mode support

### Path Aliases

- `@/*`: Root directory
- `@/components`: Component directory
- `@/lib`: Library/utilities
- `@/hooks`: Custom hooks

## Important Notes

- When adding new pages/routes, place them under `app/[locale]/` to maintain i18n structure
- New locale support requires: updating `lib/i18n/settings.ts`, adding translation files, regenerating static params
- The project uses ESLint (check `eslint.config.mjs` for rules)