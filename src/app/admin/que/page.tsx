import Admintemplate from '@/components/Admintemplate';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

const reservations = [
  {
    table: "T01",
    peoples: "3",
    time: "18:00 12/12/68",
    tell: "087-123-4567",
    note: "อาจเลทนิดนึงนะครับ",
  },
  {
    table: "T02",
    peoples: "4",
    time: "18:00 12/12/68",
    tell: "087-123-4567",
    note: "หมูนะครับ",
  },
  {
    table: "T03",
    peoples: "2",
    time: "18:00 12/12/68",
    tell: "087-123-4567",
    note: "Bank Transfer",
  },
  {
    table: "T04",
    peoples: "2",
    time: "18:00 12/12/68",
    tell: "087-123-4567",
    note: "อาจเลทนิดนึงนะครับ",
  },
  {
    table: "T05",
    peoples: "4",
    time: "18:00 12/12/68",
    tell: "087-123-4567",
    note: "หมูนะครับ",
  },
  {
    table: "T06",
    peoples: "1",
    time: "18:00 12/12/68",
    tell: "087-123-4567",
    note: "Bank Transfer",
  },
  {
    table: "T07",
    peoples: "3",
    time: "18:00 12/12/68",
    tell: "087-123-4567",
    note: "หิว",
  },
]

function Quepage() {
  return (
    <>
      <Admintemplate>
        <div className='size-full p-10  flex items-center justify-center '>
          <div className='bg-white size-full  rounded-3xl'>
            <h1 className="text-3xl pl-10 pt-5 mb-5">Reservations</h1>

            <div className='flex justify-center items-center'>
              <div className='w-[95%]'>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">TABLE</TableHead>
                      <TableHead>PEOPLES</TableHead>
                      <TableHead>TIME</TableHead>
                      <TableHead>TELL</TableHead>
                      <TableHead>NOTE</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservations.map((table) => (
                      <TableRow key={table.table}>
                        <TableCell className="font-medium">{table.table}</TableCell>
                        <TableCell>{table.peoples}</TableCell>
                        <TableCell>{table.time}</TableCell>
                        <TableCell>{table.tell}</TableCell>
                        <TableCell>{table.note}</TableCell>
                        <TableCell className="text-right ">
                          <Button className="p-3 bg-[#dc3545] rounded-xl mr-4">ยกเลิก</Button>
                          <Button className="p-3  bg-[#28a745] text-white rounded-xl">ตอบรับการจอง</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>

                </Table>

              </div>
            </div>

          </div>
        </div>
      </Admintemplate>
    </>
  )
}
export default Quepage