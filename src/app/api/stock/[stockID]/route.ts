import { NextRequest, NextResponse } from "next/server";
import { updateStock } from "@/actions/actions";

export async function PUT(
  request: NextRequest,
  { params }: { params: { stockID: string } }
) {
  try {
    const stockID = parseInt(params.stockID);
    const data = await request.json();

    // เรียกใช้ฟังก์ชัน updateStock จาก actions
    const result = await updateStock(stockID, {
      ingredientName: data.ingredientName,
      costPrice: data.costPrice,
      Unit: data.Unit,
      minQuantity: data.minQuantity
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating stock:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update ingredient';
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}