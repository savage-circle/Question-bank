# Backend

Deno + TypeScript API server for the Question Bank.

## Structure

```
backend/
├── src/
│   ├── handlers/     # Request handler functions
│   ├── services/     # Business logic layer
│   ├── routes/       # Route definitions
│   ├── constants/    # Shared constants
│   └── types/        # TypeScript type definitions
├── app.ts            # Application entry point
└── deno.json         # Deno configuration and tasks
```

## Setup

```bash
deno task dev
```

## Tasks

| Task    | Command           | Description              |
| ------- | ----------------- | ------------------------ |
| `dev`   | `deno task dev`   | Start with file watching |
| `start` | `deno task start` | Start production server  |
