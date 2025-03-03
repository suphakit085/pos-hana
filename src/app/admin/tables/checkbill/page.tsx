"use client"

import Admintemplate from "@/components/Admintemplate"
import Link from "next/link";
import { IoChevronBack } from "react-icons/io5";
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BillDetail } from '@/components/Bill-detail'
import { PaymentMethod } from '@/components/Payment-method'
import { PrintBill } from '@/components/Print-bill'
import { useSearchParams } from 'next/navigation'

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
  const searchParams = useSearchParams();
  const tableId = searchParams.get('tableId') || '';
  const customerCount = parseInt(searchParams.get('customerCount') || '0');
  
  // อัพเดท useEffect เพื่อใช้ข้อมูลที่รับมาจาก URL
  useEffect(() => {
    // เมื่อได้รับข้อมูลจาก URL ให้สร้าง billData
    const buffetType = 'standard'; // default หรือรับจาก API ตามที่ต้องการ
    const pricePerPerson = 299; // default หรือรับจาก API
    const totalPrice = customerCount * pricePerPerson;

    setBillData({
      tableNumber: tableId,
      buffetType,
      customerCount,
      pricePerPerson,
      totalPrice
    });
  }, [tableId, customerCount]);

/*  useEffect(() => {
    // ในสถานการณ์จริง ข้อมูลอาจถูกส่งผ่าน URL params หรือ state management
    if (searchParams) {
      const tableNumber = searchParams.get('table') || '1';
      const buffetType = searchParams.get('buffet') || 'ธรรมดา';
      const customerCount = parseInt(searchParams.get('count') || '1');
      const pricePerPerson = parseInt(searchParams.get('price') || '299');
      const totalPrice = customerCount * pricePerPerson;

      setBillData({
        tableNumber,
        buffetType,
        customerCount,
        pricePerPerson,
        totalPrice
      });
    }
  }, [searchParams]);
*/

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

  
  if (!billData) {
    return <Admintemplate>
      <div className='size-full p-10  flex items-center justify-center '>
      <div className='relative bg-white size-full  rounded-3xl flex items-center justify-center'>
      <div className="flex justify-center items-center ">กำลังโหลด...</div>
      </div>
      </div>
      </Admintemplate>
  }

  return (
    <>
      <Admintemplate>
        <div className='size-full p-10  flex items-center justify-center '>
          <div className='relative bg-white size-full  rounded-3xl flex items-center justify-center'>
            <Link href="/admin/tables">
              <div className="absolute top-5 left-5 cursor-pointer">
                <IoChevronBack className="text-4xl" />
              </div>
            </Link>
          
          <div className="container mx-auto py-8 px-4 md:px-6 print:p-0">
            <div className="max-w-3xl mx-auto">
              <Card className="shadow-lg print:shadow-none">
                <CardHeader className="border-b">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl md:text-3xl font-bold">ใบเช็คบิล</CardTitle>
                      <CardDescription>ร้านชาบู อร่อยดี</CardDescription>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <p className="font-semibold">วันที่: {new Date().toLocaleDateString('th-TH')}</p>
                      <p className="font-semibold">เวลา: {new Date().toLocaleTimeString('th-TH')}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-6 space-y-6">
                  <BillDetail data={billData} />

                  <div className="print:hidden">
                    <PaymentMethod
                      selectedMethod={selectedPayment}
                      onSelectMethod={handlePaymentChange}
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col sm:flex-row justify-between border-t pt-6 gap-4">
                  
                  <div className="print:hidden">
                    <Button
                      size="lg"
                      className="bg-blue-400 hover:bg-blue-600"
                      onClick={handlePrintBill}
                    >
                      <PrintBill />
                    </Button>
                  </div>
                  <div>
                    <Link href="/admin/tables">
                    <Button className="bg-green-600 hover:bg-green-700" size="lg">
                      เสร็จสิ้น
                    </Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
          </div>
        </div>
      </Admintemplate>
    </>
  )
}
export default CheckbillPage