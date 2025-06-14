import { useAuth } from "@/store/useAuth";
import axios from "axios"

export const addToWatchlist = async (movieId: string) => {
    const { token } = useAuth();
    try {
        const res = await axios.post('api/watchlist', { movieId }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (error: any) {
        console.error(error);
        throw error;
    }
}