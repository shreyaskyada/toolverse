# Jumpytools Architecture Rules

## Overview

Jumpytools is a Turborepo project containing:

- Next.js Web App
- Expo React Native App
- Shared Engine Package

The goal is to build hundreds of frontend tools while maximizing code sharing, maintainability, and performance.

These rules MUST be followed for every new tool.

---

# Repository Structure

```
jumpytools/

apps/
│
├── web/
│
└── mobile/

packages/
│
├── engines/
│
├── shared/
│
└── services/
```

---

# Tool Structure

Every tool lives inside:

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

        types.ts

        constants.ts

        validators.ts

        index.ts
```

Never create a different folder structure.

Every tool must follow the same layout.

---

# Responsibilities

## engine.ts

Contains ONLY business logic.

Allowed

- Calculations
- Parsing
- Formatting
- Validation
- Algorithms
- Data Transformation

Forbidden

- React
- React Native
- Next.js
- Expo
- JSX
- HTML
- UI
- useState
- useEffect

Engine functions must always be pure whenever possible.

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
- Calling Engine
- Performance Optimization

Never implement business logic here.

Hooks orchestrate engine functions.

Example

```ts
export function useJsonFormatter() {}
```

---

## types.ts

Contains all shared TypeScript types.

Never duplicate types.

---

## validators.ts

Contains validation logic.

Examples

- JSON Validation
- Email Validation
- Password Rules

---

## constants.ts

Contains constants only.

Example

```ts
export const MAX_JSON_SIZE = 500000;
```

---

## index.ts

Exports everything.

Example

```ts
export * from "./engine";
export * from "./hook";
export * from "./types";
```

---

# UI Responsibilities

The Web and Mobile applications are responsible only for presentation.

Allowed

- Rendering
- Navigation
- Styling
- User Input

Forbidden

- Calculations
- Parsing
- Validation
- Formatting
- Business Logic

Every screen should consume the shared hook.

Example

```tsx
const { input, output, prettify } = useJsonFormatter();
```

---

# Data Flow

Every tool MUST follow this flow.

```
User

↓

UI

↓

Shared Hook

↓

Performance Layer

↓

Engine

↓

Hook

↓

UI
```

Never bypass this flow.

---

# Performance Rules

Business Logic must NEVER contain optimization logic.

Optimization belongs inside the Hook.

Examples

✔ Debouncing

✔ Memoization

✔ Worker Execution

✔ Background Tasks

✔ Chunk Processing

✔ Streaming

✔ Caching

---

## Small Data

```
Hook

↓

Engine
```

---

## Large Data

```
Hook

↓

Worker / Background Task

↓

Engine
```

The Engine should never know where it is executing.

---

# Platform Rules

The Hook decides how the engine executes.

Example

```ts
if (json.length < MAX_JSON_SIZE) {
  return prettifyJson(json);
}

return worker.prettify(json);
```

The Engine remains unchanged.

---

# Worker Strategy

Heavy computation should never block the UI.

Examples

- JSON Formatter
- Image Compression
- Image Resize
- Image Conversion
- CSV Parser
- Excel Parser

Use

Web

- Web Worker

Mobile

- Background Thread / Native Module when required

---

# Services

Platform APIs belong in services.

Examples

```
packages/

services/

    clipboard/

    storage/

    download/

    share/

    analytics/
```

Never call platform APIs directly inside Engine.

---

# Shared Package

Shared utilities belong here.

```
packages/

shared/

    utils/

    types/

    constants/

    helpers/
```

---

# Imports

Allowed

```
UI

↓

Hook

↓

Engine

↓

Shared
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

Platform APIs
```

---

# Reusability

Before creating:

- Component
- Hook
- Engine
- Utility

Always search for an existing implementation.

Reuse first.

---

# Simplicity

Prefer

- Pure Functions
- Small Hooks
- Small Components
- Composition
- Reusability

Avoid unnecessary abstraction.

---

# Naming

Folders

```
json-formatter

password-generator

image-compressor
```

Hooks

```
useJsonFormatter()

usePercentage()

usePasswordGenerator()
```

Engine Functions

```
prettifyJson()

validateJson()

calculatePercentage()

generatePassword()
```

---

# Golden Rules

1. Business Logic belongs in Engine.

2. State belongs in Hook.

3. UI only renders.

4. Engine must never import React.

5. Engine must never know Web or Mobile.

6. Hook controls performance.

7. UI always consumes Hook.

8. Never duplicate business logic.

9. Keep every tool independent.

10. Keep the architecture identical for every new tool.

---

# Expected Output

When implementing any tool, always generate:

```
packages/

engines/

    <tool-name>/

        engine.ts

        hook.ts

        validators.ts

        constants.ts

        types.ts

        index.ts

apps/

    web/

    mobile/
```

The implementation must strictly follow this architecture unless explicitly instructed otherwise.
