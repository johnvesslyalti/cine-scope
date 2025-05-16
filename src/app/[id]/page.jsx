async function getMovie(id) {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
    if(!res.ok) throw new Error('Movie not found');
    return res.json();
}

export default async function MovieDetailPage({ params }) {
    const { id } = params;
    const movie = await getMovie(id);

    return(
        <div>
            <h1>{movie.title}</h1>
            <p>{movie.overview}</p>
             <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
        </div>
    )
}