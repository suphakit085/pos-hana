"use client";
import React, { useState, useEffect } from "react";
import CardTable from "@/components/CardTable";

interface Table {
  id: string;
  status: string;
  customercount: number;
  tabletype?: string;
}

function TableLayout() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  
  // ฟังก์ชันสำหรับดึงข้อมูลโต๊ะจาก API
  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tables');
      if (!response.ok) throw new Error('Failed to fetch tables');
      const data = await response.json();
      
      // แปลงข้อมูลเป็นรูปแบบที่ต้องการ
      const formattedTables = data.map((table: any) => ({
        id: `T${table.tabID.toString().padStart(2, '0')}`,
        status: table.tabStatus || "ว่าง", 
        customercount: table.customerCount || 0,
        tabletype: table.tabTypes || 'normal'
      }));
      
      setTables(formattedTables);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tables:', error);
      setLoading(false);
    }
  };
  
  // โหลดข้อมูลเมื่อคอมโพเนนต์ถูกโหลด และตั้งค่าการรีเฟรชทุก 30 วินาที
  useEffect(() => {
    console.log("Fetching initial table data...");
    fetchTables();
    
    // ตั้งค่าการรีเฟรชข้อมูลทุก 30 วินาที
    const intervalId = setInterval(() => {
      console.log("Auto refreshing table data...");
      fetchTables();
    }, 30000);
    
    // ทำความสะอาดเมื่อคอมโพเนนต์ถูกทำลาย
    return () => {
      console.log("Clearing refresh interval");
      clearInterval(intervalId);
    };
  }, []);
  
  // อัปเดตสถานะโต๊ะในหน้าเว็บ (อัปเดตฐานข้อมูลทำใน component อื่น)
  const handleTableStatusChange = (
    tableId: string, 
    newStatus: string, 
    newCustomerCount?: number
  ) => {
    console.log(`Updating table ${tableId} status: ${newStatus}, customers: ${newCustomerCount}`);
    setTables(prevTables => 
      prevTables.map(table => 
        table.id === tableId 
          ? { 
              ...table, 
              status: newStatus, 
              customercount: newCustomerCount !== undefined ? newCustomerCount : table.customercount 
            } 
          : table
      )
    );
  };

  // เพิ่มปุ่มรีเฟรชข้อมูลแบบแมนนวล
  const handleManualRefresh = () => {
    console.log("Manual refresh requested");
    fetchTables();
  };

  if (loading && tables.length === 0) {
    return <div className="p-5 text-center">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="p-5">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">รายการโต๊ะ</h1>
        <button 
          onClick={handleManualRefresh}
          className="px-4 py-2 bg-[#FFB8DA] text-white rounded hover:bg-[#fcc6e0]"
        >
          รีเฟรชข้อมูล
        </button>
      </div>
      
      <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-8 justify-items-center">
        {tables.map((table) => (
          <CardTable 
            key={table.id}
            tableId={table.id}
            tableStatus={table.status}
            customerCount={table.customercount}
            tableType={table.tabletype}
            onTableStatusChange={handleTableStatusChange}
          />
        ))}
      </div>
    </div>
  );
}

export default TableLayout;