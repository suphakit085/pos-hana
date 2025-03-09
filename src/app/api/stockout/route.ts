import { NextResponse } from "next/server";
import { fetchTimeScription } from "../../../actions/actions";

export async function GET() {
    const stockOut = await fetchTimeScription()
    return Response.json(stockOut);
}