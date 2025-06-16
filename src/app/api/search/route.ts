import { TMDB_API } from "@/lib/tmdb";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if(!query) {
        return NextResponse.json({ error: 'Missing query'}, { status: 400 });
    }

    const res = await axios.get(TMDB_API.searchmovies);

    const data = await res.json();

    return NextResponse.json(data.results)
}