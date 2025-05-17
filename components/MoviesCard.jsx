import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function MovieCard({ movie }) {
    return (
            <Card className="flex flex-col h-[400px] hover:scale-102 transition-transform duration-200">
                <CardHeader className="flex-shrink-0 p-5">
                    <img 
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="object-cover rounded h-48 w-full"
                    />
                </CardHeader>
                <CardContent className="flex flex-grow justify-center items-center overflow-hidden line-clamp-2">
                    <p className="text-center font-bold">{movie.title}</p>
                </CardContent>
                <CardFooter className="flex w-full justify-center items-center">
                    <Button className="font-bold cursor-pointer">Add to WatchList</Button>
                </CardFooter>
            </Card>
    )
}