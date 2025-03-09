//ฟังก์ชั่นติดต่อฐานข้อมูลทั้งหมด
"use server"
import prisma from "../utils/db";
import { StockInDetail } from "../utils/types";
import { NextResponse } from "next/server";
import { parse } from "path";
import { StockInItem } from "../utils/types";

export const addStock = async (formData: FormData) => {
  const ingredientName = formData.get("ingredientName")?.toString();
  const quantity = parseFloat(formData.get("quantity")?.toString() || "0");
  const unit = formData.get("unit")?.toString();
  const price = parseFloat(formData.get("price")?.toString() || "0.00");
  const minQuantity = parseFloat(formData.get("minQuantity")?.toString() || "0");
  const imageUrl = formData.get("imageUrl")?.toString();  // เพิ่มการรับค่า imageUrl

  if (!ingredientName) {
    throw new Error("รับชื่อวัตถุดิบไม่ได้");
  }
  else if (!ingredientName || quantity <= 0 || !unit || price <= 0) {
    throw new Error("ข้อมูลไม่ครบถ้วน");
  }

  // ตรวจสอบว่ามีสินค้าที่มีชื่อเหมือนกันใน Stock หรือไม่
  const existingStock = await prisma.stock.findUnique({
    where: {
      ingredientName: ingredientName,
    },
  });

  if (existingStock) {
    // ถ้ามีสินค้าอยู่แล้ว อัปเดตจำนวน
    const updatedStock = await prisma.stock.update({
      where: {
        stockID: existingStock.stockID,
      },
      data: {
        Quantity: existingStock.Quantity + quantity, // เพิ่มจำนวนสินค้า
        minQuantity: minQuantity,
        LastUpdated: new Date(), // อัปเดตเวลาล่าสุด
      },
    });
    return updatedStock;
  } else {
    // ถ้าไม่มีสินค้า ให้เพิ่มสินค้าตัวใหม่
    const newStock = await prisma.stock.create({
      data: {
        ingredientName: ingredientName,
        costPrice: price,
        Unit: unit,
        Quantity: quantity, // จำนวนสินค้าที่เพิ่ม
        minQuantity: minQuantity,
        imageUrl: imageUrl || null,
        LastUpdated: new Date(), // เวลาที่เพิ่มสินค้า
      },
    });
    return newStock;
  }
};


export async function addStockIn(formdata: FormData) {
  await prisma.stock_In.create({
    data: {
      stockInDateTime: new Date(),
      totalPrice: parseFloat(formdata.get("totalPrice") as string),
      Employee_empID: parseInt(formdata.get("empID") as string),
      note: formdata.get("note") as string,
    },
  });
}


//Stockนรกตอนนี้
// เพิ่ม console.log เพื่อการดีบัก
// ใน src/actions/actions.ts
// ใน src/actions/actions.ts
export const createStockInWithDetails = async (formData: FormData) => {
  try {
    console.log("Server action called");
    
    const empID = formData.get("empID");
    const totalPrice = formData.get("totalPrice");
    const itemsString = formData.get("items") as string;
    const note = formData.get("note") as string || "";
    
    console.log("empID:", empID);
    console.log("totalPrice:", totalPrice);
    console.log("note:", note);
    console.log("raw items string:", itemsString);
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!empID) {
      throw new Error("กรุณาเลือกพนักงาน");
    }

    // แปลง items string กลับเป็น array
    let items = [];
    try {
      items = JSON.parse(itemsString);
      console.log("Items after parsing:", items);
      console.log("Number of items:", items.length);
      if (items.length > 0) {
        console.log("First item:", items[0]);
      }
    } catch (error) {
      console.error("Error parsing items:", error);
      throw new Error("ข้อมูลสินค้าไม่ถูกต้อง");
    }

    // สร้าง Stock_In ด้วย transaction
    const result = await prisma.$transaction(async (tx) => {
      // สร้าง Stock_In
      const stockIn = await tx.stock_In.create({
        data: {
          stockInDateTime: new Date(),
          totalPrice: parseFloat(totalPrice as string),
          Employee_empID: parseInt(empID as string),
          note: note,
        },
      });
      
      console.log("Stock in created:", stockIn);
  
      // สร้าง Stock_In_Detail สำหรับแต่ละรายการ
      for (const item of items) {
        console.log("Processing item:", item);
        
        try {
          const stockInDetail = await tx.stock_In_Detail.create({
            data: {
              Stock_In_stockInID: stockIn.stockInID,
              Stock_stockID: parseInt(item.stockID.toString()),
              ingredientName: item.ingredientName,
              quantity: parseFloat(item.quantity.toString()),
              unit: item.unit,
              pricePerUnit: parseFloat(item.pricePerUnit.toString()),
              totalPrice: parseFloat(item.totalPrice.toString()),
            },
          });
          
          console.log("Stock in detail created:", stockInDetail);
  
          // อัพเดทจำนวนสินค้าใน Stock
          const updatedStock = await tx.stock.update({
            where: { stockID: parseInt(item.stockID.toString()) },
            data: {
              Quantity: {
                increment: parseFloat(item.quantity.toString()),
              },
              costPrice: parseFloat(item.pricePerUnit.toString()),
              LastUpdated: new Date(),
            },
          });
          
          console.log("Stock updated:", updatedStock);
        } catch (detailError) {
          console.error("Error creating stock in detail for item:", item, detailError);
          throw detailError;
        }
      }
  
      return stockIn;
    });

    return result;
  } catch (error) {
    console.error("Error in createStockInWithDetails:", error);
    throw error;
  }
};


export const outStock = async (formdata: FormData) => {
  try {
    const empID = formdata.get("empID");
    const stockID = formdata.get("stockID");
    const quantity = formdata.get("quantity");
    const unit = formdata.get("unit");

    if (!empID) {
      throw new Error("รับชื่อพนักงานไม่ได้");
    }
    if (!stockID) {
      throw new Error("รับ StockID ไม่ได้");
    }
    if (!quantity || parseFloat(quantity as string) <= 0) {
      throw new Error("รับจำนวนไม่ได้");
    }
    if (!unit) {
      throw new Error("รับหน่วยไม่ได้");
    }

    const Employee_empID = parseInt(empID as string);
    const Stock_stockID = parseInt(stockID as string);
    const Quantity = parseFloat(quantity as string);
    const Unit = unit as string;
    const tsCreatedAt = new Date();
    const note = formdata.get("note") as string;

    // สร้างข้อมูลการเบิกของใน TimeScription
    const stock_out = await prisma.timeScription.create({
      data: {
        Employee_empID,
        Stock_stockID,
        tsCreatedAt,
        Unit,
        Quantity,
        note,
      },
    });

    // เช็คจำนวนของในสต็อกก่อนที่จะเบิก
    const currentStock = await prisma.stock.findUnique({
      where: { stockID: Stock_stockID }
    });

    if (!currentStock || currentStock.Quantity < Quantity) {
      throw new Error("จำนวนในสต็อกไม่พอสำหรับการเบิก");
    }

    // หักจำนวนจาก stock หลัก
    const updatedStock = await prisma.stock.update({
      where: { stockID: Stock_stockID },
      data: {
        Quantity: {
          decrement: Quantity,
        },
        LastUpdated: new Date(),
      },
    });

    return { stock_out, updatedStock };
  } catch (error) {
    console.error("Error fetching stock:", error);
    return [];
  }
};



//fetch ข้อมูลจากฐานข้อมูล
export const fetchStock = async (searchTerm = '') => {
  try {
    const stocks = await prisma.stock.findMany({
      where: {
        isDeleted: false, // แสดงเฉพาะรายการที่ยังไม่ถูกลบ
        ingredientName: {
          contains: searchTerm,
          // mode: 'insensitive' // ค้นหาโดยไม่สนใจตัวพิมพ์ใหญ่-เล็ก
        }
      },
    });
    return stocks;
  } catch (error) {
    console.error('Fetch stock error:', error);
    throw error;
  }
};

export const fetchStockIn = async () => {
  try {
    const stock_In = await prisma.stock_In.findMany({
      where: {
        isCanceled: false // เพิ่มเงื่อนไขให้แสดงเฉพาะรายการที่ยังไม่ถูกยกเลิก
      },
      include: {
        employee: true,
        canceledByEmployee: true // เพิ่ม relation กับพนักงานที่ยกเลิก
      },
    });
    return stock_In;
  } catch (error) {
    console.error("Error fetching stock:", error);
    return [];
  }
};


//ดึงข้อมูลพนักงาน
export const fetchEmployee = async () => {
  try {
    const employee = await prisma.employee.findMany();
    return employee;
  } catch (error) {
    console.error("Error fetching stock:", error);
    return [];
  }
}

export const fetchTimeScription = async () => {
  try {
    const stock_out = await prisma.timeScription.findMany({
      include: {
        stock: true, // คำสั่ง join กับตาราง employee
        employee: true // คำสั่ง join กับตาราง employee
      }
    });
    return stock_out
  } catch (error) {
    console.error("Error fetching stock:", error);
    return [];
  }
};


export const fetchStockInDetails = async (stockInID: number) => {
  try {
    // ดึงข้อมูลจาก Stock_In และ Stock_In_Detail พร้อมกัน
    const stockInData = await prisma.stock_In.findUnique({
      where: {
        stockInID
      },
      include: {
        employee: true,
        stockInDetail: {
          include: {
            stock: true // เพิ่ม relation กับตาราง Stock
          }
        }
      }
    });

    if (!stockInData) {
      throw new Error("ไม่พบข้อมูลการนำเข้า");
    }

    // จัดรูปแบบข้อมูลที่จะส่งกลับ
    return {
      stockIn: {
        stockInID: stockInData.stockInID,
        stockInDateTime: stockInData.stockInDateTime,
        totalPrice: stockInData.totalPrice,
        employee: stockInData.employee,
        note: stockInData.note
      },
      details: stockInData.stockInDetail.map(detail => ({
        stockInDetailID: detail.stockInDetailID,
        ingredientName: detail.ingredientName,
        quantity: detail.quantity,
        unit: detail.unit,
        pricePerUnit: detail.pricePerUnit,
        totalPrice: detail.totalPrice,
        stock: detail.stock
      }))
    };
  } catch (error) {
    console.error("Error fetching stock in details:", error);
    throw error;
  }
};


// ฟังก์ชันสำหรับแก้ไข stock
export async function updateStock(stockID: number, data: {
  ingredientName?: string;
  costPrice?: number;
  Unit?: string;
  minQuantity?: number;
}) {
  try {
    const updated = await prisma.stock.update({
      where: { stockID },
      data: {
        ...data,
        LastUpdated: new Date()
      }
    });
    return updated;
  } catch (error) {
    console.error('Update stock error:', error);
    throw error;
  }
}

// เพิ่มฟังก์ชันสำหรับ Soft Delete
export const deleteStock = async (stockID: number) => {
  try {
    // เพิ่ม console.log เพื่อตรวจสอบค่า stockID ที่ได้รับ
    console.log('Attempting to delete stock:', stockID);

    // ตรวจสอบว่ามีการใช้งานใน Stock_In_Detail หรือ StockOutDetail หรือไม่
    const stockInUse = await prisma.stock_In_Detail.findFirst({
      where: { Stock_stockID: stockID }
    });

    const stockOutUse = await prisma.stockOutDetail.findFirst({
      where: { stockID }
    });

    if (stockInUse || stockOutUse) {
      throw new Error("ไม่สามารถลบได้เนื่องจากมีการใช้งานในประวัติการนำเข้าหรือเบิกออก");
    }

    // ตรวจสอบสถานะปัจจุบันของ stock
    const currentStock = await prisma.stock.findUnique({
      where: { stockID }
    });
    console.log('Current stock status:', currentStock);

    // ทำ Soft Delete
    const updatedStock = await prisma.stock.update({
      where: { 
        stockID: stockID 
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        LastUpdated: new Date()
      },
    });

    // เพิ่ม console.log เพื่อตรวจสอบผลลัพธ์
    console.log('Updated stock result:', updatedStock);

    // ตรวจสอบอีกครั้งว่าการอัพเดทสำเร็จ
    const verifyUpdate = await prisma.stock.findUnique({
      where: { stockID }
    });
    console.log('Verification after update:', verifyUpdate);

    return { 
      success: true, 
      data: updatedStock,
      message: 'ลบวัตถุดิบเรียบร้อยแล้ว'
    };

  } catch (error) {
    console.error('Delete stock error:', error);
    throw new Error(error instanceof Error ? error.message : 'ไม่สามารถลบวัตถุดิบได้');
  }
};


export const cancelStockIn = async (
  stockInID: number,
  canceledByEmpID: number,
  cancelNote: string
) => {
  try {
    // เริ่ม transaction
    return await prisma.$transaction(async (tx) => {
      // ดึงข้อมูล StockIn และรายละเอียด
      const stockIn = await tx.stock_In.findUnique({
        where: { stockInID },
        include: {
          stockInDetail: {
            include: {
              stock: true // เพิ่มการดึงข้อมูล stock
            }
          }
        }
      });

      if (!stockIn) {
        throw new Error("ไม่พบรายการนำเข้า");
      }

      if (stockIn.isCanceled) {
        throw new Error("รายการนี้ถูกยกเลิกไปแล้ว");
      }

      // ตรวจสอบและลดจำนวนสินค้าในสต็อก
      for (const detail of stockIn.stockInDetail) {
        const stock = detail.stock;
        if (!stock) {
          throw new Error(`ไม่พบข้อมูลสินค้ารหัส ${detail.Stock_stockID}`);
        }

        // ตรวจสอบว่าจำนวนคงเหลือพอที่จะลดหรือไม่
        if (stock.Quantity < detail.quantity) {
          throw new Error(
            `ไม่สามารถยกเลิกได้เนื่องจากจำนวนคงเหลือของ ${stock.ingredientName} ไม่เพียงพอ`
          );
        }

        // ลดจำนวนสินค้าในสต็อก
        await tx.stock.update({
          where: { stockID: detail.Stock_stockID },
          data: {
            Quantity: {
              decrement: detail.quantity
            },
            LastUpdated: new Date()
          }
        });
      }

      // อัพเดทสถานะการยกเลิกใน StockIn
      const updatedStockIn = await tx.stock_In.update({
        where: { stockInID },
        data: {
          isCanceled: true,
          canceledAt: new Date(),
          cancelNote: cancelNote,
          canceledBy: canceledByEmpID
        }
      });

      return updatedStockIn;
    });
  } catch (error) {
    // จัดการกับ error ให้ถูกต้อง
    console.error("Error canceling stock in:", error instanceof Error ? error.message : "Unknown error");
    
    // ตรวจสอบประเภทของ error ก่อนโยน
    if (error instanceof Error) {
      throw error;
    } else {
      // แปลง error ที่ไม่ใช่ Error instance เป็น Error object
      throw new Error("เกิดข้อผิดพลาดในการยกเลิกการนำเข้าสินค้า");
    }
  }
};

