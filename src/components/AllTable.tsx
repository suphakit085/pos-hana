"use client";
import React from "react";
import CardTable from "@/components/CardTable";

function TableLayout() {
  // ข้อมูลโต๊ะทั้งหมด
  const tables = [
    { id: "T01", status: "ว่าง" , customercount: 0 },
    { id: "T02", status: "ว่าง" , customercount: 0 },
    { id: "T03", status: "จอง" , customercount: 2 },
    { id: "T04", status: "ว่าง" , customercount: 0 },
    { id: "T05", status: "ว่าง" , customercount: 0 },
    { id: "T06", status: "ว่าง" , customercount: 0 },
    { id: "T07", status: "ว่าง" , customercount: 0 },
    { id: "T08", status: "มีลูกค้า" , customercount: 3 },
    { id: "T09", status: "มีลูกค้า" , customercount: 4 },
    { id: "T10", status: "ว่าง" , customercount: 0 },
    { id: "T11", status: "ว่าง" , customercount: 0 },
    { id: "T12", status: "ว่าง" , customercount: 0 },
    { id: "T13", status: "ว่าง" , customercount: 0 },
    { id: "T14", status: "ว่าง" , customercount: 0 },
    { id: "T15", status: "ว่าง" , customercount: 0 },
    { id: "T16", status: "ว่าง" , customercount: 0 },
    { id: "VIP01", status: "ว่าง" , customercount: 0 },
    // เพิ่มโต๊ะอื่นๆ ตามต้องการ
  ];

  return (
    <div className="p-5">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-8 justify-items-center">
        {tables.map((table) => (
          <CardTable 
            key={table.id} 
            tableId={table.id} 
            tableStatus={table.status} 
            customerCount={table.customercount}
          />
        ))}
      </div>
    </div>
  );
}

export default TableLayout;