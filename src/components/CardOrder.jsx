import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter,
  } from "@/components/ui/table"
import {Button} from "@/components/ui/button"

  const orders = [
    {
      menu: "หมูสามชั้น",
      option:"ถาดใหญ่",
      totalAmount: "$ 00.00",
      qty:"2",
    },
    {
      menu: "เนื้อออสเตรเลีย",
      option:"ถาดใหญ่",
      totalAmount: "$ 00.00",
      qty:"1",
    },
    {
      menu: "ลูกชิ้นลาวาชีส",
      option:"ถาดใหญ่",
      totalAmount: "$ 00.00",
      qty:"4",
    },
    {
      menu: "หมูหมักงา",
      option:"ถาดใหญ่",
      totalAmount: "$ 00.00",
      qty:"2",
    },
    {
      menu: "กะหล่ำปลี",
      option:"ถาดใหญ่",
      totalAmount: "$ 00.00",
      qty: "10",
    },
    {
      menu: "ผักบุ้ง",
      option:"ถาดใหญ่",
      totalAmount: "$ 00.00",
      qty: "4",
    },
    {
      menu: "เนื้อวากิว",
      option: "-",
      totalAmount: "$ 00.00",
      qty:"2",
    },

  ]

function CardOrder() {
  return (
    <>
        <Card className="relative max-w-[550px] min-h-[500px]">
            <CardHeader>
                <CardTitle className="">
                    <div className="absolute bg-[#F4FFB8] w-[80px] h-[100px] top-0 left-10 flex  justify-center items-center drop-shadow-md rounded-b-xl"><p className="text-2xl">T 1</p></div>
                    <div className="text-end">
                        <p>01/02/2567</p>
                        <p className="text-end mt-3">14:49:21</p>
                    </div>
                </CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="mt-10">
                

            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[200px]">Menu</TableHead>
                    <TableHead>Option</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((orders) => (
                    <TableRow key={orders.menu}>
                        <TableCell className="font-medium">{orders.menu}</TableCell>
                        <TableCell>{orders.option}</TableCell>
                        <TableCell>{orders.qty}</TableCell>
                        <TableCell className="text-right">{orders.totalAmount}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                
            </Table>


            </CardContent>
            <CardFooter className="flex justify-end items-center">
               <Button className="p-6 bg-[#dc3545] rounded-xl mr-4">ยกเลิก</Button>
               <Button className="p-6  bg-[#28a745] text-white rounded-xl">เสร็จสิ้น</Button>
            </CardFooter>
        </Card>
        
    </>
  )
}
export default CardOrder