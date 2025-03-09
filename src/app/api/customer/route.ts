import { NextResponse } from "next/server";
import { fetchEmployee, fetchStock } from "../../../actions/actions";



export async function GET() {
  // const stock = await fetchStock();
  // return Response.json(stock);
  const customer = await fetchEmployee();
  return Response.json(customer);
}