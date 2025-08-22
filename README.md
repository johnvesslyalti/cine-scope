Project Title:

    Cine Scope

Description:

    Cine Scope is a full-stack movie exploration web application where users can browse trending, top-rated, and upcoming movies, view detailed movie information, and manage their personalized watchlist.

Demo:

![Home Page Screenshot](/public/cine-scope-demo.png)

Features:

    1. Authentication & Authorization
        - Google OAuth authentication with NextAuth.js
        - Secure session management
        - Protected routes for logged-in users
        - User profile with Google account information
    
    2. Movie Discovery
        - Browse movies categorized as:
            Now Playing
            Popular
            Top Rated
            Upcoming Releases
        - Each movie card includes poster, title, release year, and rating
        - Detailed movie page with additional metadata (genres, overview, etc.)
    
    3. Enhanced Movie Details
        - Cast information with photos and character names
        - Similar movies recommendations
        - Movie trailers via YouTube integration
        - Financial information (budget, revenue)
        - Runtime and vote statistics
    
    4. Advanced Search System
        - Search movies by title
        - Advanced filters by genre, year, and rating
        - Search history with localStorage persistence
        - Pagination for search results
    
    5. Trending Carousel
        - Interactive Keen Slider-powered carousel for trending movies
        - Auto-scroll animation using a custom useAutoSlider hook
    
    6. Watchlist System
        - Add or remove movies to/from personal watchlist
        - View watchlist in a dedicated page (/watchlist)
        - Persistent state using Zustand and synced with PostgreSQL backend
        - Secure API endpoints under /api/watchlist for authorized users

    7. Notification System
        - Toast notifications for user actions
        - Success, error, info, and warning message types
        - Animated notifications with auto-dismiss

    8. Theme Support
        - Toggle between light and dark themes using ThemeProvider.tsx

    9. Navigation & Layout
        - Reusable Navbar and Footer
        - Responsive navigation links from constants/Navlinks.ts
        - Shadcn UI for consistent styling across inputs, alerts, and cards
        - User profile display in navigation

    10. Backend API (Next.js API Routes)

        RESTful API for:

            - GET/POST/DELETE /api/watchlist – Manage watchlist items
            - GET /api/search – Search movies with filters
            - GET /api/genres – Get movie genres for filters
            - GET /api/movies/[id]/videos – Get movie trailers

    11. Modern UI/UX
        - Built with Tailwind CSS and Shadcn UI components
        - Fully responsive for mobile, tablet, and desktop
        - Clean animations, icons (React Icons), and adaptive layout
        - Loading skeletons for better user experience

Tech Stack:

    Frontend:
        Next.js + TypeScript
        Tailwind CSS
        Shadcn UI
        React Icons
        Framer Motion

    Backend:
        Next.js API Routes + TypeScript
        NextAuth.js for authentication
    
    Database:
        PostgreSQL
        Prisma ORM

    State Management:
        Zustand

    Authentication:
        NextAuth.js
        Google OAuth Provider

Installation:

    1. Clone the repository
    2. Install dependencies:
       ```bash
       npm install
       ```

    3. Set up environment variables:
       Create a `.env.local` file with the following variables:
       ```
       # Database
       DATABASE_URL="postgresql://username:password@localhost:5432/cine_scope"
       
       # NextAuth.js
       NEXTAUTH_SECRET="your-nextauth-secret-key-here"
       NEXTAUTH_URL="http://localhost:3000"
       
       # Google OAuth (Get these from Google Cloud Console)
       GOOGLE_CLIENT_ID="your-google-client-id"
       GOOGLE_CLIENT_SECRET="your-google-client-secret"
       
       # TMDB API
       NEXT_PUBLIC_TMDB_API_KEY="your-tmdb-api-key"
       ```

    4. Set up Google OAuth:
       - Go to Google Cloud Console (https://console.cloud.google.com/)
       - Create a new project or select existing one
       - Enable Google+ API
       - Go to Credentials → Create Credentials → OAuth 2.0 Client ID
       - Set authorized redirect URI to: `http://localhost:3000/api/auth/callback/google`
       - Copy Client ID and Client Secret to your .env.local file

    5. Set up TMDB API:
       - Go to https://www.themoviedb.org/settings/api
       - Request an API key
       - Copy the API key to your .env.local file

    6. Set up database:
       ```bash
       npx prisma migrate dev
       npx prisma generate
       ```

    7. Run the development server:
       ```bash
       npm run dev
       ```

Folder Structure:

    cine-scope/
            |- prisma/
            |- public/
            |- src/
                |- app/
                    |- api/
                        |- auth/
                            |- [...nextauth]/
                                |- route.ts
                        |- genres/
                            |- route.ts
                        |- movies/
                            |- [id]/
                                |- videos/
                                    |- route.ts
                        |- search/
                            |- route.ts
                        |- watchlist/
                            |- route.ts
                    |- login/
                        |- page.tsx
                    |- movie/
                        |- [id]/
                            |- page.tsx
                    |- search/
                        |- page.tsx
                        |- SearchClient.tsx
                    |- watchlist/
                        |- page.tsx
                    |- globals.css
                    |- layout.tsx
                    |- page.tsx
                |- components/
                    |- ui/
                    |- AuthProvider.tsx
                    |- Footer.tsx
                    |- LoadingSkeleton.tsx
                    |- Navbar.tsx
                    |- Notification.tsx
                    |- NowPlayingMovies.tsx
                    |- Popular.tsx
                    |- ThemeProvider.tsx
                    |- TopRatedMovies.tsx
                    |- TrailerModal.tsx
                    |- TrendingCorousel.tsx
                    |- UpComingRelease.tsx
                |- constants/
                    |- Navlinks.ts
                |- hooks/
                    |- useAutoSlider.ts
                |- lib/
                    |- auth.ts
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