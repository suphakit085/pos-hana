import Admintemplate from "@/components/Admintemplate"
import CardOrder from "@/components/CardOrder"
import FoodOrderTable from "@/components/FoodOrderTable";
import { Button } from "@/components/ui/button";

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

const products = [
  {
    id: "1",
    name: "เนื้อออสเตรเลีย",
    remaining: "70",
    unit: "KG",
    min: "70",
    status: "ปกติ",
    dateupdate: "20-11-2025 18:00",
  },
  {
    id: "2",
    name: "เนื้อไก่",
    remaining: "50",
    unit: "KG",
    min: "20",
    status: "เหลือน้อย",
    dateupdate: "20-11-2025 18:00",
  },
]

function getStatusClass(status: string) {
  switch (status) {
    case "เสิร์ฟแล้ว":
      return "bg-green-200";
    case "เหลือน้อย":
      return "bg-red-200";
    default:
      return "";
  }
}


function Orderpage() {
  return (
    <>
      <Admintemplate>
        <div className='size-full p-10  flex items-center justify-center '>
          <div className='bg-white size-full  rounded-3xl p-5'>
          <FoodOrderTable />

          </div>
        </div>
      </Admintemplate>
    </>
  )
}
export default Orderpage