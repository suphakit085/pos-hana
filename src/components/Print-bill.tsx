import { Printer } from "lucide-react"

export function PrintBill() {
  return (
    <div className="flex items-center gap-2">
      <Printer className="h-5 w-5" />
      <span>พิมพ์ใบเสร็จ</span>
    </div>
  )
}