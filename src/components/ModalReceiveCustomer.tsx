"use client";
import React, { useState, useEffect } from 'react';
import { MdOutlineCancel } from "react-icons/md";
import { useRouter } from 'next/navigation';

interface TableClickProps {
    tableId: string;
    tableStatus: string;
    customerCount: number;
    onClose: () => void;
    onOrderCreated?: (newStatus: string, newCustomerCount: number) => void;
}

interface BuffetType {
    buffetTypeID: number;
    buffetTypesName: string;
    buffetTypePrice: number;
}

interface Employee {
    empID: number;
    empFname: string;
    empLname: string;
    position: string;
}

function ModalReceiveCustomer({ tableId, tableStatus, customerCount, onClose, onOrderCreated }: TableClickProps) {
    const router = useRouter();
    const [newCustomerCount, setNewCustomerCount] = useState<number>(customerCount || 1);
    const [buffetTypes, setBuffetTypes] = useState<BuffetType[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedBuffetType, setSelectedBuffetType] = useState<number | null>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    // โหลดข้อมูล buffet types และ employees
    useEffect(() => {
        async function fetchData() {
            try {
                console.log("Fetching buffet types and employees...");
                // Fetch Buffet Types
                const buffetResponse = await fetch("/api/buffet");
                if (!buffetResponse.ok) throw new Error("Failed to fetch buffet types");
                const buffetData = await buffetResponse.json();
                setBuffetTypes(buffetData);
        
                // Fetch Employees
                const employeeResponse = await fetch("/api/employees");
                if (!employeeResponse.ok) throw new Error("Failed to fetch employees");
                const employeeData = await employeeResponse.json();
                setEmployees(employeeData);
                console.log("Data fetched successfully");
            } catch (err) {
                console.error("Error fetching data:", err);
                alert("เกิดข้อผิดพลาดในการโหลดข้อมูล");
            }
        }

        fetchData();
    }, []);

    // สร้างออเดอร์และ redirect ไปหน้า QR Code
    const handleCreateOrder = async () => {
        // ตรวจสอบข้อมูล
        if (!selectedBuffetType) {
            alert('กรุณาเลือกประเภทบุฟเฟ่ต์');
            return;
        }

        if (!selectedEmployee) {
            alert('กรุณาเลือกพนักงาน');
            return;
        }

        if (newCustomerCount < 1) {
            alert('จำนวนลูกค้าต้องมากกว่า 0');
            return;
        }

        setIsLoading(true);

        try {
            console.log("Creating order...");
            const tablesId = parseInt(tableId.replace(/[^\d]/g, ''));
            
            // สร้างออเดอร์ใหม่
            const response = await fetch("/api/orders/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    Tables_tabID: tablesId,
                    Employee_empID: selectedEmployee,
                    BuffetTypes_buffetTypeID: selectedBuffetType,
                    orderStatus: "PENDING",
                    totalCustomerCount: newCustomerCount,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                
                // จัดการข้อผิดพลาด Table is already reserved
                if (errorData.error === "Table is already reserved") {
                    setIsLoading(false);
                    alert(errorData.message || "โต๊ะนี้มีลูกค้าอยู่แล้ว กรุณาเลือกโต๊ะอื่น หรือเช็คบิลโต๊ะนี้ก่อน");
                    return;
                }
                
                throw new Error(errorData.error || 'Failed to create order');
            }
            
            // รับข้อมูล QR Code
            const data = await response.json();
            console.log("Order created successfully:", data);
            
            // แจ้ง component แม่ให้อัปเดต UI
            if (onOrderCreated) {
                console.log("Calling onOrderCreated with:", "มีลูกค้า", newCustomerCount);
                onOrderCreated("มีลูกค้า", newCustomerCount);
            }
            
            onClose(); // ปิด modal
            
            // Redirect ไปยังหน้า QR Code
            if (data && data.orderItemId) {
                console.log("Redirecting to QR code page:", data.orderItemId);
                router.push(`/admin/qrcode/${data.orderItemId}`);
            } else {
                console.error("No orderItemId in response:", data);
                throw new Error("No orderItemId in response");
            }
            
        } catch (err) {
            console.error("Error creating order:", err);
            
            // แสดงข้อความข้อผิดพลาดที่เข้าใจง่าย
            if (err instanceof Error) {
                if (err.message.includes("Employee ID") && err.message.includes("not found")) {
                    alert('ไม่พบข้อมูลพนักงานที่เลือก กรุณาเลือกพนักงานอื่น');
                } else if (err.message.includes("Buffet Type ID") && err.message.includes("not found")) {
                    alert('ไม่พบข้อมูลประเภทบุฟเฟต์ที่เลือก กรุณาเลือกประเภทบุฟเฟต์อื่น');
                } else if (err.message.includes("Table ID") && err.message.includes("not found")) {
                    alert('ไม่พบข้อมูลโต๊ะที่เลือก กรุณาเลือกโต๊ะอื่น');
                } else {
                    alert(`เกิดข้อผิดพลาดในการสร้างออเดอร์: ${err.message}`);
                }
            } else {
                alert('เกิดข้อผิดพลาดในการสร้างออเดอร์');
            }
            
            setIsLoading(false);
        }
    };
    
    // แสดงฟอร์มกรอกข้อมูล
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
             style={{ zIndex: 9999 }}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                {/* Modal Header */}
                <div className="bg-gray-100 px-4 py-3 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">
                        โต๊ะ {tableId} - {tableStatus}
                        {customerCount > 0 && ` (${customerCount} คน)`}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <MdOutlineCancel className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">รับลูกค้า</h3>
                        <div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนลูกค้า</label>
                                    <div className="flex items-center">
                                        <button
                                            className="bg-[#FFB8DA] px-3 py-1 rounded-l-md hover:bg-[#fcc6e0]"
                                            onClick={() => setNewCustomerCount(Math.max(1, newCustomerCount - 1))}
                                            type="button"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            value={newCustomerCount}
                                            onChange={(e) => setNewCustomerCount(parseInt(e.target.value) || 1)}
                                            className="text-center border-t border-b w-16 py-1"
                                        />
                                        <button
                                            className="bg-[#FFB8DA] px-3 py-1 rounded-r-md hover:bg-[#fcc6e0]"
                                            onClick={() => setNewCustomerCount(newCustomerCount + 1)}
                                            type="button"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทบุฟเฟ่ต์</label>
                                    <select 
                                        value={selectedBuffetType || ''} 
                                        onChange={(e) => setSelectedBuffetType(Number(e.target.value))}
                                        className='border p-2 rounded-lg w-full'
                                    >
                                        <option value="">เลือกประเภทบุฟเฟ่ต์</option>
                                        {buffetTypes.map((buffet) => (
                                            <option key={buffet.buffetTypeID} value={buffet.buffetTypeID}>
                                                {buffet.buffetTypesName} (฿{buffet.buffetTypePrice})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">พนักงาน</label>
                            <select 
                                value={selectedEmployee || ''} 
                                onChange={(e) => setSelectedEmployee(Number(e.target.value))}
                                className='border p-2 rounded-lg w-full'
                            >
                                <option value="">เลือกพนักงาน</option>
                                {employees.map((employee) => (
                                    <option key={employee.empID} value={employee.empID}>
                                        {employee.empFname} {employee.empLname} - {employee.position}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            className="w-full bg-[#FFB8DA] text-white py-2 rounded-md hover:bg-[#fcc6e0] disabled:opacity-50"
                            onClick={handleCreateOrder}
                            disabled={isLoading || !selectedBuffetType || !selectedEmployee}
                            type="button"
                        >
                            {isLoading ? 'กำลังบันทึก...' : 'ยืนยัน'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalReceiveCustomer;