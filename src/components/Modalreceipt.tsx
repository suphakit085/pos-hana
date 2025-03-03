"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { deflate } from "zlib"

interface ReceiptItem {
  name: string
  quantity: number
  unit: string
  pricePerUnit: number
  totalPrice: number
}

interface ReceiptProps {
  receiptNumber: string
  date: string
  staffName: string
  items?: ReceiptItem[]
  totalAmount?: number
  closemodal?: () => void
}

const item = [
    {
      id: 1,
      name:"เนื้อออสเตรเลีย",
      quantity: "30",
      unit: "KG",
      pricePerUnit: 80,
      totalPrice: 2400,
    },

  ]


function ModalReceipt({receiptNumber, date, staffName, items = [], totalAmount = 0, closemodal }: ReceiptProps) {
  return (
    <Card className="w-full max-w-[800px] mx-auto border border-gray-200 shadow-sm relative">
      {closemodal && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 h-8 w-8 rounded-full" 
          onClick={closemodal}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">ปิด</span>
        </Button>
      )}
      <CardHeader className="pb-2">
        <div className="space-y-1.5">
          <h2 className="text-lg font-bold">รายละเอียดการนำเข้าสินค้า #{receiptNumber}</h2>
          <div className="text-sm text-muted-foreground">
            <p>วันที่: {date}</p>
            <p>พนักงาน: {staffName}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">ชื่อวัตถุดิบ</TableHead>
              <TableHead className="w-[180px] text-right">จำนวน</TableHead>
              <TableHead className="w-[180px] text-right">หน่วย</TableHead>
              <TableHead className="w-[180px] text-right">ราคาต่อหน่วย</TableHead>
              <TableHead className="w-[180px] text-right">ราคารวม</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, id) => (
              <TableRow key={id}>
                <TableCell>{item.name}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">{item.unit}</TableCell>
                <TableCell className="text-right">฿{item.pricePerUnit.toFixed(2)}</TableCell>
                <TableCell className="text-right">฿{item.totalPrice.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} className="text-right font-medium">รวมทั้งหมด</TableCell>
              <TableCell className="text-right font-bold">฿{totalAmount.toFixed(2)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  )
}export default ModalReceipt