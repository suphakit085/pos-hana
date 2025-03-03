import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatPrice } from "@/lib/utils"

interface BillDetailProps {
  data: {
    tableNumber: string;
    buffetType: string;
    customerCount: number;
    pricePerPerson: number;
    totalPrice: number;
    paymentMethod?: string;
  }
}

export function BillDetail({ data }: BillDetailProps) {
  return (
    <Card className="border bg-slate-50/50 p-4">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <p className="font-medium text-gray-700">โต๊ะ: <span className="font-bold text-black">{data.tableNumber}</span></p>
            <p className="font-medium text-gray-700">จำนวนลูกค้า: <span className="font-bold text-black">{data.customerCount} ท่าน</span></p>
          </div>
          <div>
            <p className="font-medium text-gray-700">ประเภทบุฟเฟ่ต์: <span className="font-bold text-black">{data.buffetType}</span></p>
            {data.paymentMethod && (
              <p className="font-medium text-gray-700">ชำระโดย: <span className="font-bold text-black">{data.paymentMethod === 'cash' ? 'เงินสด' : data.paymentMethod === 'promptpay' ? 'พร้อมเพย์' : 'บัตรเครดิต'}</span></p>
            )}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>รายการ</TableHead>
              <TableHead className="text-right">จำนวน</TableHead>
              <TableHead className="text-right">ราคา/คน</TableHead>
              <TableHead className="text-right">รวม</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>ชาบู {data.buffetType}</TableCell>
              <TableCell className="text-right">{data.customerCount}</TableCell>
              <TableCell className="text-right">{formatPrice(data.pricePerPerson)}</TableCell>
              <TableCell className="text-right">{formatPrice(data.totalPrice)}</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>ยอดรวมทั้งสิ้น</TableCell>
              <TableCell className="text-right font-bold text-lg">{formatPrice(data.totalPrice)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </Card>
  )
}