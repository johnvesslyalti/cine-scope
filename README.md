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
            |- prisma/
            |- public/
            |- src/
                |- app/
                    |- api/
                        |- auth/
                            |- login/
                                |- route.ts
                            |- register/
                                |- route.ts
                            |- users/
                                |-me/
                                    |- route.ts
                        |- watchlist/
                            |- route.ts
                    |- login/
                        |- page.tsx
                    |- movie/
                        |- page.tsx
                    |- register/
                        |- page.tsx
                    |- watchlist/
                        |- page.tsx
                    |- globals.css
                    |- layout.tsx
                    |- page.tsx
                |- components/
                    |- ui/
                    |- Footer.tsx
                    |- Navbar.tsx
                    |- NowPlayingMovies.tsx
                    |- Popular.tsx
                    |- ThemeProvider.tsx
                    |- TopRatedMovies.tsx
                    |- TrendingCorousel.tsx
                    |- UpComingRelease.tsx
                |- constants/
                    |- Navlinks.ts
                |- hooks/
                    |- useAutoSlider.ts
                |- lib/
                    |- auth.ts
                    |- jwt.ts
                    |- prisma.ts
                    |- tmdb.ts
                    |- utils.ts
                    |- watchlistAPI.ts
                |- store/
                    |- cineStore.ts
                    |- useAuth.ts
                |- types/
                    |- index.d.ts
                |- validation/
                    |- auth.schema.ts