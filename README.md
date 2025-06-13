Tech Stack:

    Frontend:
        Next.js + TypeScipt
        Tailwind CSS
        Shadcn UI
        React Icons

    Backend:
        Next.js API Routes + TypeScipt
    
    Database:
        PostgreSQL
        Prisma ORM

    State Management:
        Zustand

    Authentication:
        NextAuth.js
        Custom JWT Auth

Installation:

    1. npx create-next-app@latest
    2. npm install @prisma/client prisma next-auth @next-auth/prisma-adapter zustand shadcn/ui react-icons
    3. npm install bcrypt jsonwebtoken zod
    4. npm install --save-dev @types/jsonwebtoken @types/bcrypt
    5. npm install keen-slider
    6. npm install axios

    shadcn:
        npx shadcn@latest add card
        npx shadcn@latest add label
        npx shadcn@latest add input
        npx shadcn@latest add alert

Folder Structure:

    cine-scope/
            │
            ├── prisma/
            │   ├── schema.prisma
            │   └── seed.ts                  # Optional: for dev/test data
            │
            ├── public/                      # Public assets like images
            │
            ├── src/
            │   ├── app/                     # Next.js App Router
            │   │   ├── (auth)/              # Login/Register layout
            │   │   ├── dashboard/           # Protected user dashboard
            │   │   ├── movies/              # /movies route and details
            │   │   │   ├── [movieId]/       # Movie details
            │   │   │   └── page.tsx
            │   │   ├── api/                 # Route handlers (Next.js API)
            │   │   │   ├── auth/            # Auth APIs
            │   │   │   ├── movies/          # Movie APIs (CRUD)
            │   │   │   ├── reviews/         # Review APIs
            │   │   │   ├── watchlist/       # Watchlist APIs
            │   │   │   ├── favorites/       # Favorite APIs
            │   │   │   └── users/           # Profile APIs
            │   │   └── layout.tsx
            │   │   └── page.tsx
            │
            │   ├── components/              # Reusable UI components
            │   │   ├── layout/
            │   │   ├── movie/
            │   │   ├── buttons/
            │   │   └── auth/
            │
            │   ├── constants/               # Static constants (genres, routes)
            │
            │   ├── db/                      # Prisma DB utils
            │   │   └── index.ts             # Prisma client instance
            │
            │   ├── hooks/                   # Custom React hooks
            │
            │   ├── lib/                     # Server utilities
            │   │   ├── auth.ts              # Auth middleware utils
            │   │   ├── api.ts               # Axios wrapper for API requests
            │   │   ├── middleware.ts        # Middleware functions
            │   │   └── utils.ts             # Generic helpers
            │
            │   ├── middlewares/            # Next.js middlewares (auth, rate-limit)
            │
            │   ├── store/                   # Zustand stores or context
            │
            │   ├── types/                   # TypeScript types & interfaces
            │   │   └── index.ts
            │
            │   ├── validation/              # Zod schemas
            │   │   └── movie.schema.ts
            │   │   └── user.schema.ts
            │
            │   └── styles/                  # Tailwind, global.css, or MUI theme
            │       └── globals.css
            │
            ├── .env
            ├── next.config.js
            ├── tailwind.config.js
            ├── tsconfig.json
            └── package.json
