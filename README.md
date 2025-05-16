Cine Scope

This is the application where you can view the movies information, add to your
watchlist, checkout list and many more...

Key Features:

1. View movies and their info
2. Add to Watchlist
3. Add to checkoutlist

cine-scope/
├── app/
│   ├── layout.jsx                # Root layout (Navbar, global styles)
│   ├── page.jsx                  # Home page (Trending movies)
│   ├── movie/
│   │   └── [id]/
│   │       └── page.jsx          # Movie details page
│   ├── search/
│   │   └── page.jsx              # Search results page
│   ├── genre/
│   │   └── [id]/
│   │       └── page.jsx          # Movies by genre
│   └── watchlist/
│       └── page.jsx              # User's saved movies (optional)
│
├── components/
│   ├── Navbar.jsx                # Site header/navigation
│   ├── HeroBanner.jsx           # Featured movies banner
│   ├── MovieCard.jsx            # Individual movie card
│   ├── MovieList.jsx            # List of movies (grid or scroll)
│   ├── SearchBar.jsx            # Search input component
│   ├── GenreFilter.jsx          # Genre filter buttons/dropdown
│   ├── Pagination.jsx           # Page navigation
│   ├── WatchlistButton.jsx      # Add/remove from watchlist
│   ├── Loader.jsx               # Loading spinner or skeleton
│   └── ErrorMessage.jsx         # Display error messages
│
├── lib/
│   ├── tmdb.js                   # TMDB API fetch functions
│   └── utils.js                  # General utilities (e.g. formatDate)
│
├── context/
│   └── WatchlistContext.jsx     # Context API for saved movies (optional)
│
├── public/
│   └── logo.png                  # App logo and other static assets
│
├── styles/
│   ├── globals.css              # Tailwind base/global styles
│   └── custom.css               # Custom classes (if any)
│
├── .env.local                   # API keys and secrets
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
├── package.json
└── README.md

cine-scope/
├── app/
│   ├── login/
│   │   └── page.jsx           # Login form
│   ├── signup/
│   │   └── page.jsx           # Signup form
│   ├── dashboard/
│   │   └── page.jsx           # Protected user dashboard (optional)
│
├── components/
│   ├── AuthForm.jsx           # Reusable form component
│
├── lib/
│   ├── auth.js                # JWT functions, token validation
│   ├── db.js                  # DB connection logic (MongoDB)
│
├── models/
│   └── User.js                # Mongoose user schema
│
├── api/
│   ├── signup/
│   │   └── route.js           # POST handler for creating user
│   └── login/
│       └── route.js           # POST handler for authenticating user
