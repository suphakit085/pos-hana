"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@radix-ui/react-separator"
import { Edit3, Package2, BadgeDollarSign, Scale, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface ModalEditIngreProps {
  closemodal: () => void
  product: {
    stockID: string
    ingredientName: string
    Quantity: number
    Unit: string
    minQuantity: number
    costPrice: number
  }
}

export default function ModalEditIngre({ closemodal, product }: ModalEditIngreProps) {
  const [formData, setFormData] = useState({
    ingredientName: product.ingredientName,
    Unit: product.Unit,
    minQuantity: product.minQuantity,
    costPrice: product.costPrice
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch(`/api/stock/${product.stockID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          Quantity: product.Quantity
        }),
      })

      // ได้รับ response แล้ว ให้ดึง error message จาก response body
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update ingredient');
      }

      toast.success('แก้ไขวัตถุดิบสำเร็จ')
      closemodal()
    } catch (error) {
      toast.error(`ไม่สามารถแก้ไขวัตถุดิบได้: ${error.message}`)
      console.error(error)
    }
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-[#FFB8DA]" />
            แก้ไขวัตถุดิบ
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            ID: {product.stockID}
          </p>
        </div>
        <button
          onClick={closemodal}
          className="text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 p-2 transition-colors"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ชื่อวัตถุดิบ */}
        <div className="space-y-2">
          <Label htmlFor="ingredientName" className="flex items-center gap-2">
            <Package2 className="w-4 h-4 text-muted-foreground" />
            ชื่อวัตถุดิบ
          </Label>
          <Input
            id="ingredientName"
            value={formData.ingredientName}
            onChange={(e) => setFormData(prev => ({ ...prev, ingredientName: e.target.value }))}
            className="focus-visible:ring-[#FFB8DA]"
            placeholder="ระบุชื่อวัตถุดิบ"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* ราคาต้นทุน */}
          <div className="space-y-2">
            <Label htmlFor="costPrice" className="flex items-center gap-2">
              <BadgeDollarSign className="w-4 h-4 text-muted-foreground" />
              ราคาต้นทุน/หน่วย
            </Label>
            <div className="relative">
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                value={formData.costPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, costPrice: Number(e.target.value) }))}
                className="focus-visible:ring-[#FFB8DA] pr-8"
                placeholder="0.00"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                ฿
              </span>
            </div>
          </div>

          {/* หน่วย */}
          <div className="space-y-2">
            <Label htmlFor="unit" className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-muted-foreground" />
              หน่วย
            </Label>
            <Input
              id="unit"
              value={formData.Unit}
              onChange={(e) => setFormData(prev => ({ ...prev, Unit: e.target.value }))}
              className="focus-visible:ring-[#FFB8DA]"
              placeholder="เช่น กรัม, ชิ้น"
              required
            />
          </div>
        </div>

        {/* จำนวนขั้นต่ำ */}
        <div className="space-y-2">
          <Label htmlFor="minQuantity" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
            จำนวนขั้นต่ำที่ต้องมี
          </Label>
          <div className="relative">
            <Input
              id="minQuantity"
              type="number"
              value={formData.minQuantity}
              onChange={(e) => setFormData(prev => ({ ...prev, minQuantity: Number(e.target.value) }))}
              className="focus-visible:ring-[#FFB8DA] pr-16"
              placeholder="ระบุจำนวน"
              required
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {formData.Unit}
            </span>
          </div>
        </div>

        <Separator className="my-6" />

        {/* แสดงข้อมูลคงเหลือ */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">จำนวนคงเหลือปัจจุบัน</div>
            <div className="text-lg font-semibold">
              {product.Quantity} {formData.Unit}
            </div>
          </div>
        </div>

        {/* ปุ่มดำเนินการ */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={closemodal}
            className="border-gray-200 hover:bg-gray-50"
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            className="bg-[#FFB8DA] hover:bg-[#fcc6e0] text-black font-medium px-6"
          >
            บันทึกการแก้ไข
          </Button>
        </div>
      </form>
    </div>
  )
}