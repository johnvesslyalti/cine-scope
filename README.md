Project Title:

    Cine Scope

Description:

    Cine Scope is a full-stack movie exploration web application where users can browse trending, top-rated, and upcoming movies, view detailed movie information, and manage their personalized watchlist.

Demo:

![Home Page Screenshot](/public/cine-scope-demo.png)

Features:

    1. Authentication & Authorization
        - User registration and login with secure password hashing (bcrypt)
        - Session-based authentication with NextAuth.js and JWT
        - Protected routes for logged-in users
        - View current user session via /api/auth/users/me
    
    2. Movie Discovery
        - Browse movies categorized as:
            Now Playing
            Popular
            Top Rated
            Upcoming Releases
        - Each movie card includes poster, title, release year, and rating
        - Detailed movie page with additional metadata (genres, overview, etc.)
    
    3. Trending Carousel
        - Interactive Keen Slider-powered carousel for trending movies
        - Auto-scroll animation using a custom useAutoSlider hook
    
    4. Watchlist System
        - Add or remove movies to/from personal watchlist
        - View watchlist in a dedicated page (/watchlist)
        - Persistent state using Zustand and synced with PostgreSQL backend
        - Secure API endpoints under /api/watchlist for authorized users

    5. Theme Support
        - Toggle between light and dark themes using ThemeProvider.tsx

    6. Navigation & Layout
        - Reusable Navbar and Footer
        - Responsive navigation links from constants/Navlinks.ts
        - Shadcn UI for consistent styling across inputs, alerts, and cards

    7. Backend API (Next.js API Routes)

        RESTful API for:

            - POST /api/auth/register – Register new users
            - POST /api/auth/login – Authenticate users
            - GET /api/auth/users/me – Get logged-in user data
            - GET/POST/DELETE /api/watchlist – Manage watchlist items

    8. Modern UI/UX
        - Built with Tailwind CSS and Shadcn UI components
        - Fully responsive for mobile, tablet, and desktop
        - Clean animations, icons (React Icons), and adaptive layout

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

Contributing:

    Contributions are welcome! Please fork the repo and submit a pull request.