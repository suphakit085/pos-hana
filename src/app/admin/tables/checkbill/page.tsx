"use client"

import React, { useState, useEffect } from 'react'
import Admintemplate from "@/components/Admintemplate"
import Link from "next/link";
import { IoChevronBack } from "react-icons/io5";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BillDetail } from '@/components/Bill-detail'
import { PaymentMethod } from '@/components/Payment-method'
import { PrintBill } from '@/components/Print-bill'
import { useSearchParams } from 'next/navigation'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Printer } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

interface BillProps {
  tableNumber: string;
  buffetType: string;
  customerCount: number;
  pricePerPerson: number;
  totalPrice: number;
  paymentMethod?: string;
}

interface billClickProps {
  tableId: string;
  customerCount: number;
}

function CheckbillPage() {
  const [billData, setBillData] = useState<BillProps | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>('cash');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [billPaid, setBillPaid] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'PAID'>('PENDING');
  const [shouldCloseOrder, setShouldCloseOrder] = useState(true);
  const [paymentDateTime, setPaymentDateTime] = useState<Date | null>(null);
  
  const searchParams = useSearchParams();
  const tableId = searchParams.get('tableId') || '';
  const customerCount = parseInt(searchParams.get('customerCount') || '0');

  useEffect(() => {
    async function fetchTableAndOrderData() {
      if (!tableId) {
        setError('ไม่พบข้อมูลโต๊ะ');
        setLoading(false);
        return;
      }

      try {
        console.log("กำลังดึงข้อมูลโต๊ะ ID:", tableId);
        
        // ตัดตัวอักษร "T" ออกจาก tableId ถ้ามี
        let cleanTableId = tableId;
        if (tableId.startsWith('T') || tableId.startsWith('t')) {
          cleanTableId = tableId.substring(1);
        }
        
        // สร้างข้อมูลบิลโดยใช้ข้อมูลที่มีอยู่ก่อน
        // เพื่อให้สามารถแสดงหน้าเช็คบิลได้ แม้จะยังไม่สามารถดึงข้อมูลจาก API ได้
        const defaultBillData = {
          tableNumber: `T${cleanTableId.toString().padStart(2, '0')}`,
          buffetType: 'ธรรมดา',
          customerCount: customerCount || 1,
          pricePerPerson: 299,
          totalPrice: (customerCount || 1) * 299
        };
        
        setBillData(defaultBillData);
        
        // แปลง tableId เป็นตัวเลขก่อนส่งไปยัง API
        const numericTableId = parseInt(cleanTableId);
        
        if (isNaN(numericTableId)) {
          console.error("รูปแบบ ID โต๊ะไม่ถูกต้อง:", tableId, "หลังจากตัด T แล้ว:", cleanTableId);
          throw new Error(`รูปแบบ ID โต๊ะไม่ถูกต้อง: "${tableId}"`);
        }
        
        // ดึงข้อมูลโต๊ะ
        const tableResponse = await fetch(`/api/tables/${numericTableId}`);
        if (!tableResponse.ok) {
          console.error("ไม่สามารถดึงข้อมูลโต๊ะได้:", tableResponse.statusText);
          // ไม่ throw error ที่นี่ เพื่อให้โค้ดทำงานต่อไปได้
        } else {
          const tableData = await tableResponse.json();
          console.log("ข้อมูลโต๊ะ:", tableData);
          
          // อัพเดตข้อมูลบิลด้วยข้อมูลโต๊ะที่ได้
          defaultBillData.tableNumber = `T${tableData.tabID.toString().padStart(2, '0')}`;
        }

        try {
          // ดึงข้อมูลออเดอร์ล่าสุดของโต๊ะนี้
          const orderResponse = await fetch(`/api/orders?tableId=${numericTableId}&status=active`);
          if (!orderResponse.ok) {
            console.error("ไม่สามารถดึงข้อมูลออเดอร์ได้:", orderResponse.statusText);
            // ไม่ throw error ที่นี่ เพื่อให้โค้ดทำงานต่อไปได้
          } else {
            const orderData = await orderResponse.json();
            console.log("ข้อมูลออเดอร์:", orderData);

            if (orderData && orderData.length > 0) {
              const latestOrder = orderData[0]; // ใช้ออเดอร์ล่าสุด
              
              // คำนวณราคารวม
              const pricePerPerson = latestOrder.buffetType?.buffetTypePrice || 299;
              const totalPrice = customerCount * pricePerPerson;

              // อัพเดตข้อมูลบิลด้วยข้อมูลออเดอร์ที่ได้
              setBillData({
                ...defaultBillData,
                buffetType: latestOrder.buffetType?.buffetTypesName || 'ธรรมดา',
                pricePerPerson: pricePerPerson,
                totalPrice: totalPrice
              });
            }
          }
        } catch (orderErr) {
          console.error("เกิดข้อผิดพลาดในการดึงข้อมูลออเดอร์:", orderErr);
          // ไม่ throw error ที่นี่ เพื่อให้โค้ดทำงานต่อไปได้
        }

      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล');
      } finally {
        setLoading(false);
      }
    }

    fetchTableAndOrderData();
  }, [tableId, customerCount]);

  const handlePaymentChange = (method: string) => {
    setSelectedPayment(method);
    if (billData) {
      setBillData({
        ...billData,
        paymentMethod: method
      });
    }
  };

  const handlePrintBill = () => {
    // เปิดหน้าต่างการพิมพ์เอกสาร
    window.print();
  };

  const handlePayBill = async () => {
    if (!billData || !tableId) return;

    try {
      // แสดงข้อความยืนยันการชำระเงิน
      if (!confirm(`ยืนยันการชำระเงิน ${billData.totalPrice} บาท?`)) {
        return;
      }

      // เปลี่ยนสถานะการชำระเงินเป็น "ชำระแล้ว"
      setPaymentStatus('PAID');
      
      // บันทึกเวลาที่ชำระเงิน
      const currentDateTime = new Date();
      setPaymentDateTime(currentDateTime);
      
      let success = true;
      
      // ตัดตัวอักษร "T" ออกจาก tableId ถ้ามี
      let cleanTableId = tableId;
      if (tableId.startsWith('T') || tableId.startsWith('t')) {
        cleanTableId = tableId.substring(1);
      }
      
      // แปลง tableId เป็นตัวเลขก่อนส่งไปยัง API
      const numericTableId = parseInt(cleanTableId);
      
      if (isNaN(numericTableId)) {
        throw new Error(`รูปแบบ ID โต๊ะไม่ถูกต้อง: "${tableId}"`);
      }
      
      console.log("กำลังชำระเงินสำหรับโต๊ะ:", numericTableId);
      
      try {
        // ส่งข้อมูลการชำระเงินไปยัง API
        const response = await fetch('/api/bills/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tableId: numericTableId,
            customerCount: billData.customerCount,
            totalAmount: billData.totalPrice,
            paymentMethod: selectedPayment,
            paymentStatus: paymentStatus
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("ไม่สามารถบันทึกข้อมูลการชำระเงินได้:", response.statusText, errorData);
          success = false;
        } else {
          const result = await response.json();
          console.log("บันทึกข้อมูลการชำระเงินสำเร็จ:", result);
          
          // อัพเดทเวลาที่ชำระเงินจาก API response ถ้ามี
          if (result.paymentDateTime) {
            setPaymentDateTime(new Date(result.paymentDateTime));
          }
        }
      } catch (err) {
        console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูลการชำระเงิน:", err);
        success = false;
      }

      try {
        // อัพเดตสถานะโต๊ะเป็นว่าง
        const updateTableResponse = await fetch(`/api/tables/${numericTableId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: shouldCloseOrder ? 'ว่าง' : 'มีลูกค้า'
          }),
        });

        if (!updateTableResponse.ok) {
          const errorData = await updateTableResponse.json();
          console.error("ไม่สามารถอัพเดตสถานะโต๊ะได้:", updateTableResponse.statusText, errorData);
          
          // ตรวจสอบว่าเป็นข้อผิดพลาด Table is already reserved หรือไม่
          if (errorData.error === "Table is already reserved") {
            // ถ้าโต๊ะถูกจองไว้แล้ว ให้แสดงข้อความแจ้งเตือนและถามว่าต้องการดำเนินการต่อหรือไม่
            if (!confirm("โต๊ะนี้มีการจองไว้แล้ว ไม่สามารถเปลี่ยนสถานะเป็น 'ว่าง' ได้\nต้องการดำเนินการต่อโดยไม่เปลี่ยนสถานะโต๊ะหรือไม่?")) {
              // ถ้าไม่ต้องการดำเนินการต่อ ให้ยกเลิกการชำระเงิน
              throw new Error("ยกเลิกการชำระเงินเนื่องจากโต๊ะมีการจองไว้แล้ว");
            }
            // ถ้าต้องการดำเนินการต่อ ให้ทำการชำระเงินโดยไม่เปลี่ยนสถานะโต๊ะ
            console.log("ดำเนินการชำระเงินต่อโดยไม่เปลี่ยนสถานะโต๊ะ");
          } else {
            // ถ้าเป็นข้อผิดพลาดอื่น ให้บันทึกว่าไม่สำเร็จ
            success = false;
          }
        } else {
          const result = await updateTableResponse.json();
          console.log("อัพเดตสถานะโต๊ะสำเร็จ:", result);
        }
      } catch (err) {
        console.error("เกิดข้อผิดพลาดในการอัพเดตสถานะโต๊ะ:", err);
        
        // ตรวจสอบว่าเป็นข้อผิดพลาดจากการยกเลิกโดยผู้ใช้หรือไม่
        if (err instanceof Error && err.message === "ยกเลิกการชำระเงินเนื่องจากโต๊ะมีการจองไว้แล้ว") {
          // ถ้าเป็นการยกเลิกโดยผู้ใช้ ให้ยกเลิกการทำงานทั้งหมด
          throw err;
        }
        
        success = false;
      }

      // ปิดออเดอร์เฉพาะเมื่อเลือกตัวเลือกการปิดออเดอร์
      if (shouldCloseOrder) {
        try {
          // อัพเดตสถานะออเดอร์เป็นปิดแล้ว
          const updateOrderResponse = await fetch(`/api/orders/close`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              tableId: numericTableId
            }),
          });

          if (!updateOrderResponse.ok) {
            const errorData = await updateOrderResponse.json();
            console.error("ไม่สามารถอัพเดตสถานะออเดอร์ได้:", updateOrderResponse.statusText, errorData);
            
            // ตรวจสอบว่าเป็นข้อผิดพลาด No active orders found หรือไม่
            if (errorData.error === "No active orders found for this table") {
              console.log("ไม่พบออเดอร์ที่ยังไม่ปิดสำหรับโต๊ะนี้ ข้ามขั้นตอนการปิดออเดอร์");
              // ไม่ถือว่าเป็นข้อผิดพลาด เพราะอาจไม่มีออเดอร์ที่ยังไม่ปิด
            } else {
              success = false;
            }
          } else {
            const result = await updateOrderResponse.json();
            console.log("อัพเดตสถานะออเดอร์สำเร็จ:", result);
          }
        } catch (err) {
          console.error("เกิดข้อผิดพลาดในการอัพเดตสถานะออเดอร์:", err);
          success = false;
        }
      } else {
        console.log("ไม่ปิดออเดอร์ตามที่เลือกไว้");
      }

      // แสดงข้อความสำเร็จและกลับไปหน้าโต๊ะ
      if (success) {
        alert('ชำระเงินสำเร็จ');
        setBillPaid(true);
        // แสดงปุ่มพิมพ์ใบเสร็จอัตโนมัติ
        setTimeout(() => {
          window.print();
        }, 500);
      } else {
        alert('ชำระเงินสำเร็จ แต่มีบางส่วนที่ไม่สามารถอัพเดตข้อมูลได้');
        setBillPaid(true);
      }
      
      // ไม่รีไดเร็คกลับไปหน้าโต๊ะอัตโนมัติ
      // window.location.href = '/admin/tables';
    } catch (err: any) {
      console.error('Error paying bill:', err);
      
      // แม้จะเกิดข้อผิดพลาด แต่ไม่รีไดเร็คอัตโนมัติ
      alert(`เกิดข้อผิดพลาด: ${err.message || 'ไม่สามารถชำระเงินได้'}`);
      /*
      if (confirm(`เกิดข้อผิดพลาด: ${err.message || 'ไม่สามารถชำระเงินได้'}\nต้องการกลับไปหน้าโต๊ะหรือไม่?`)) {
        window.location.href = '/admin/tables';
      }
      */
    }
  };

  if (loading) {
    return <Admintemplate>
      <div className='size-full p-10 flex items-center justify-center'>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    </Admintemplate>;
  }
  
  if (error || !billData) {
    return <Admintemplate>
      <div className='size-full p-10 flex items-center justify-center'>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">เกิดข้อผิดพลาด</h2>
          <p className="mb-4">{error || 'ไม่พบข้อมูลบิล'}</p>
          <Button onClick={() => window.location.href = '/admin/tables'}>กลับไปหน้าโต๊ะ</Button>
        </div>
      </div>
    </Admintemplate>;
  }

  return (
    <Admintemplate>
      <div className='size-full p-10'>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">เช็คบิล</h1>
            <Button onClick={handlePrintBill} className="flex items-center">
              <Printer className="mr-2 h-4 w-4" />
              พิมพ์ใบเสร็จ
            </Button>
          </div>

          {/* ส่วนแสดงข้อมูลบิล */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 print:shadow-none">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">ใบเสร็จรับเงิน</h2>
              <p className="text-gray-500">Hana Shabu</p>
              <p className="text-gray-500">123 ถนนสุขุมวิท กรุงเทพฯ 10110</p>
              <p className="text-gray-500">โทร: 02-123-4567</p>
            </div>

            <div className="flex justify-between mb-4">
              <div>
                <p className="font-medium">เลขที่ใบเสร็จ: INV-{new Date().getFullYear()}{(new Date().getMonth() + 1).toString().padStart(2, '0')}{new Date().getDate().toString().padStart(2, '0')}-{tableId}</p>
              </div>
              <div>
                <p className="font-medium">วันที่: {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="font-medium">เวลา: {new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>

            {/* แสดงสถานะการชำระเงิน */}
            <div className="mb-4">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  paymentStatus === 'PAID' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></span>
                {paymentStatus === 'PAID' ? 'ชำระเงินแล้ว' : 'รอการชำระเงิน'}
              </div>
            </div>

            <div className="border-t border-b py-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">โต๊ะ:</span>
                <span>{billData.tableNumber}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">ประเภทบุฟเฟต์:</span>
                <span>{billData.buffetType}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">จำนวนลูกค้า:</span>
                <span>{billData.customerCount} คน</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">ราคาต่อคน:</span>
                <span>{billData.pricePerPerson.toLocaleString()} บาท</span>
              </div>
            </div>

            <div className="border-b pb-4 mb-4">
              <h3 className="font-medium mb-2">รายละเอียดการคำนวณ</h3>
              <div className="flex justify-between mb-2">
                <span>ราคาต่อคน × จำนวนลูกค้า</span>
                <span>{billData.pricePerPerson.toLocaleString()} × {billData.customerCount} = {(billData.pricePerPerson * billData.customerCount).toLocaleString()} บาท</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>ยอดรวมก่อนภาษี (93%)</span>
                <span>{(billData.totalPrice * 0.93).toLocaleString()} บาท</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>ภาษีมูลค่าเพิ่ม 7%</span>
                <span>{(billData.totalPrice * 0.07).toLocaleString()} บาท</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xl font-bold mb-6">
              <span>ยอดรวมทั้งสิ้น:</span>
              <span>{billData.totalPrice.toLocaleString()} บาท</span>
            </div>

            {/* ส่วนเลือกวิธีการชำระเงิน */}
            <div className="print:hidden">
              <h3 className="font-medium mb-3">วิธีการชำระเงิน:</h3>
              <RadioGroup value={selectedPayment} onValueChange={handlePaymentChange} className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash">เงินสด</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit" id="credit" />
                  <Label htmlFor="credit">บัตรเครดิต</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="promptpay" id="promptpay" />
                  <Label htmlFor="promptpay">พร้อมเพย์</Label>
                </div>
              </RadioGroup>
              
              {/* เพิ่มตัวเลือกการปิดออเดอร์ */}
              <div className="mt-4 border-t pt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="closeOrder" 
                    checked={shouldCloseOrder}
                    onCheckedChange={(checked) => setShouldCloseOrder(checked as boolean)}
                  />
                  <Label htmlFor="closeOrder" className="text-sm">
                    ปิดออเดอร์หลังชำระเงิน (ลูกค้าจะไม่สามารถสั่งอาหารเพิ่มได้)
                  </Label>
                </div>
              </div>
            </div>

            {/* แสดงวิธีการชำระเงินในใบเสร็จ */}
            {billData.paymentMethod && (
              <div className="mt-4 print:block hidden">
                <div className="flex justify-between">
                  <span className="font-medium">วิธีการชำระเงิน:</span>
                  <span>
                    {billData.paymentMethod === 'cash' && 'เงินสด'}
                    {billData.paymentMethod === 'credit' && 'บัตรเครดิต'}
                    {billData.paymentMethod === 'promptpay' && 'พร้อมเพย์'}
                  </span>
                </div>
                {paymentDateTime && (
                  <div className="flex justify-between mt-2">
                    <span className="font-medium">เวลาที่ชำระเงิน:</span>
                    <span>
                      {paymentDateTime.toLocaleDateString('th-TH', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })} {paymentDateTime.toLocaleTimeString('th-TH', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="text-center text-gray-500 text-sm mt-8 print:block hidden">
              <p>ขอบคุณที่ใช้บริการ</p>
              <p>{new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>

          {/* ปุ่มชำระเงิน */}
          <div className="print:hidden">
            {!billPaid ? (
              <div className="space-y-4">
                {/* ปุ่มยืนยันการชำระเงิน */}
                <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                  <div>
                    <h3 className="font-medium">สถานะการชำระเงิน</h3>
                    <p className={paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}>
                      {paymentStatus === 'PAID' ? 'ลูกค้าชำระเงินแล้ว' : 'รอลูกค้าชำระเงิน'}
                    </p>
                  </div>
                  <Button 
                    className={`${paymentStatus === 'PAID' ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'}`}
                    onClick={() => setPaymentStatus(paymentStatus === 'PAID' ? 'PENDING' : 'PAID')}
                  >
                    {paymentStatus === 'PAID' ? 'ยกเลิกการชำระเงิน' : 'ยืนยันการชำระเงิน'}
                  </Button>
                </div>
                
                {/* ปุ่มบันทึกบิล */}
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  onClick={handlePayBill}
                  disabled={paymentStatus !== 'PAID'}
                >
                  บันทึกบิล
                </Button>
                {paymentStatus !== 'PAID' && (
                  <p className="text-sm text-red-500 text-center">* กรุณายืนยันการชำระเงินก่อนบันทึกบิล</p>
                )}
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                <Button className="w-full" onClick={handlePrintBill}>
                  พิมพ์ใบเสร็จอีกครั้ง
                </Button>
                <Button className="w-full" onClick={() => window.location.href = '/admin/tables'}>
                  กลับไปหน้าโต๊ะ
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Admintemplate>
  );
}
export default CheckbillPage