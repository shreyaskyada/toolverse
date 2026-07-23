# Jumpytools Development Guide

## Project Overview

Jumpytools is a Turborepo project.

Platforms:

- Next.js (Web)
- Expo React Native (Mobile)

The goal is to build hundreds of reusable frontend tools while sharing as much code as possible.

Every implementation must follow the architecture below.

Never invent a different structure.

---

# Repository Structure

```
jumpytools/

apps/
│
├── web/
│
└── mobile/
│
packages/
│
├── engines/
│
├── services/
│
└── shared/
```

---

# Tool Architecture

Every tool MUST be placed inside

```
packages/engines/<tool-name>/
```

Example

```
packages/

engines/

    json-formatter/

        engine.ts

        hook.ts

        validators.ts

        constants.ts

        types.ts

        index.ts
```

Every tool MUST have exactly this structure unless explicitly instructed otherwise.

---

# Responsibilities

## engine.ts

Contains ONLY business logic.

Examples

- Calculations
- Parsing
- Formatting
- Validation
- Algorithms
- Transformations

Forbidden

- React Components
- JSX
- HTML
- CSS
- Tailwind
- React Native Components
- Next.js
- Expo

Engine functions should be pure whenever possible.

Example

```ts
export function prettifyJson() {}

export function calculatePercentage() {}

export function generatePassword() {}
```

---

## hook.ts

Contains shared React logic.

Responsibilities

- useState
- useReducer
- useMemo
- useCallback
- Engine calls
- Tool state
- Performance orchestration

Business logic must NEVER exist inside hook.ts.

The hook orchestrates engine functions.

Example

```ts
export function useJsonFormatter() {}
```

---

## validators.ts

Contains validation logic.

Examples

- JSON validation
- Email validation
- URL validation
- Password validation

---

## constants.ts

Contains tool constants only.

Example

```ts
export const MAX_JSON_SIZE = 500000;
```

---

## types.ts

Contains TypeScript types.

Never duplicate shared types.

---

## index.ts

Exports the public API.

Example

```ts
export * from "./engine";
export * from "./hook";
export * from "./types";
```

---

# Web Application Rules

Every tool has its own folder.

Example

```
apps/web/

    app/tools/json-formatter/
        page.tsx

    modules/tools/json-formatter/
        JsonFormatterTool.tsx
        components/
```

Responsibilities

- Rendering
- Styling
- User interaction
- Responsive UI

Never place business logic inside the Web application.

Always consume the shared hook.

Example

```tsx
const tool = useJsonFormatter();
```

---

# Mobile Application Rules

Every tool has its own folder.

Example

```
apps/mobile/

tools/

    json-formatter/

        screen.tsx

        JsonFormatterTool.tsx

        components/
```

Responsibilities

- Rendering
- Styling
- Native interactions
- Responsive layout

Never place business logic inside Mobile.

Always consume the shared hook.

---

# Shared Rule

Everything reusable belongs inside packages.

Everything UI-specific belongs inside apps.

Never duplicate business logic.

---

# Layout Rules

Each platform owns its own layouts.

Web

```
apps/web/layouts/
```

Mobile

```
apps/mobile/layouts/
```

Example

```
ToolLayout

ToolHeader

ToolFooter

ResultSection

ActionBar
```

Layouts are NOT shared between Web and Mobile.

---

# Components

Components should be grouped by feature.

Example

```
apps/web/app/tools/

    json-formatter/

        JsonFormatterTool.tsx

        components/

            JsonInput.tsx

            JsonOutput.tsx

            JsonToolbar.tsx
```

Avoid large components.

Prefer composition.

---

# Data Flow

Every tool MUST follow this flow.

```
User

↓

Web / Mobile UI

↓

Shared Hook

↓

Engine

↓

Hook

↓

UI
```

Never bypass the hook.

Never call engine functions directly from UI.

---

# Performance Rules

The Engine should NEVER contain performance logic.

Performance belongs inside the Hook.

Examples

- Debounce
- Memoization
- Background execution
- Chunking
- Caching

---

Small Data

```
Hook

↓

Engine
```

Large Data

```
Hook

↓

Worker / Background Execution

↓

Engine
```

The engine must never know where it is running.

---

# Platform APIs

Clipboard

Download

Storage

Share

Camera

File Picker

must always go through

```
packages/services/
```

Never call platform APIs inside Engine.

---

# Import Rules

Allowed

```
UI

↓

Hook

↓

Engine

↓

Shared / Services
```

Forbidden

```
Engine

↓

React

Engine

↓

UI

Engine

↓

Platform Components
```

---

# Naming

Folders

```
json-formatter

percentage

password-generator

image-compressor
```

Hooks

```
useJsonFormatter

usePercentage

usePasswordGenerator
```

Engine Functions

```
prettifyJson

calculatePercentage

generatePassword
```

---

# Reuse

Before writing code

Always search for

- Existing Engine
- Existing Hook
- Existing Utility
- Existing Service

Reuse first.

Never duplicate code.

---

# Simplicity

Prefer

- Small functions
- Pure functions
- Reusable hooks
- Reusable components

Avoid unnecessary abstractions.

---

# Golden Rules

1. Business logic belongs in Engine.

2. State belongs in Hook.

3. UI only renders.

4. Web and Mobile own their own UI.

5. Engine must never know about Web or Mobile.

6. Never duplicate business logic.

7. Every tool must have identical structure.

8. Every tool must work on both Web and Mobile.

9. Keep every tool self-contained.

10. Reuse before creating new code.

---

# When Implementing A New Tool

Whenever asked to implement a tool, ALWAYS perform the following:

1. Create a new folder under:

```
packages/engines/<tool-name>/
```

with:

```
engine.ts
hook.ts
validators.ts
constants.ts
types.ts
index.ts
```

2. Create the Web implementation:

```
apps/web/app/tools/<tool-name>/
    page.tsx

apps/web/modules/tools/<tool-name>/
    <ToolName>Tool.tsx
    components/
```

3. Create the Mobile implementation:

```
apps/mobile/tools/<tool-name>/
```

including:

```
screen.tsx
<ToolName>Tool.tsx
components/
```

4. Wire both Web and Mobile to use the shared hook from:

```
packages/engines/<tool-name>
```

5. Never duplicate business logic between Web and Mobile.

6. If a reusable service or utility is needed, place it in `packages/services` or `packages/shared` rather than inside the apps.



# Before Writing Any Code

Before implementing a tool, always:

1. Check if similar functionality already exists.
2. Reuse existing services, hooks, and utilities where possible.
3. Explain the planned file structure.
4. Then generate the code.
5. If the requested architecture conflicts with these rules, ask for confirmation instead of inventing a new structure.