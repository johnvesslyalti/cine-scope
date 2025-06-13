export const navLinks = [
    {label: "Home", path: "/", authRequired: false},
    {label: "Movies", path: "/movies", authRequired: true},
    {label: "TV Shows", path: "/tv", authRequired: true},
    {label: "Login", path: "/login", authRequired: false, guestOnly: true},
    {label: "Register", path: "/register", authRequired: false, guestOnly: true},
]