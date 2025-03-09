export interface StockItem {
    id: number;
    name: string;
    quantity: number;
    unit: string;
    minQuantity: number;
}

export interface StockListProps {
    stocks: { ingredientName: string }[]; // stocks เป็น array ของ object
}

export interface stock_InProps {
    stockInID: number;
    stockInDateTime: string;
    totalPrice: number;
    Employee_empID: number;
    employee?: {
        name: string;
        // ข้อมูลอื่นๆ ของพนักงาน
    };
    note?: string;
}

// types.ts
export interface StockInDetail {
    stockID: number;
    ingredientName: string;
    quantity: number;
    unit: string;
    pricePerUnit: number;
    totalPrice: number;
  }


  export interface StockInFormData {
    stockInID: string;
    ingredientName: string;
    quantity: string;
    unit: string;
    pricePerUnit: string;
    totalPrice: string;
    employee: string;
    note: string;
  }

  // types.ts
export interface StockInItem {
    stockID: number;
    id: string;
    ingredientName: string;
    quantity: string;
    unit: string;
    pricePerUnit: string;
    totalPrice: string;
  }

  
export interface StockCardProps {
    stock: {
      stockID: number;
      ingredientName: string;
      Quantity: number;
      Unit: string;
      costPrice: number;
      LastUpdated: any;
      minQuantity?: number; // เพิ่มฟิลด์จำนวนขั้นต่ำ
      imageUrl?: string; // เพิ่มฟิลด์สำหรับ URL รูปภาพ
    };
    onEdit?: (stockID: number) => void;
    onDelete?: (stockID: number) => void;
  }
  
  



