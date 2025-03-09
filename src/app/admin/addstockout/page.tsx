"use client"

import Admintemplate from "@/components/Admintemplate"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast, Toaster } from "sonner"
import { 
  Package2, ArrowLeftRight, User, Calendar, ClipboardList, 
  ArrowLeft, Send, Loader2, Search, Plus, Minus 
} from "lucide-react"
import { outStock } from "@/actions/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import ComboBoxCus from "@/components/combobox/ComboBoxCus"

function AddStockoutPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [ingredients, setIngredients] = useState([])
  const [selectedIngredient, setSelectedIngredient] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [note, setNote] = useState("")
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [employees, setEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState("")

  // ดึงข้อมูลวัตถุดิบทั้งหมด
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch("/api/stock")
        if (!response.ok) throw new Error("Failed to fetch ingredients")
        const data = await response.json()
        setIngredients(data)
      } catch (error) {
        console.error("Error fetching ingredients:", error)
        toast.error("ไม่สามารถโหลดข้อมูลวัตถุดิบได้")
      }
    }

    // ดึงข้อมูลพนักงานทั้งหมด
    const fetchEmployees = async () => {
      try {
        const response = await fetch("/api/customer")
        if (!response.ok) throw new Error("Failed to fetch employees")
        const data = await response.json()
        setEmployees(data)
      } catch (error) {
        console.error("Error fetching employees:", error)
        toast.error("ไม่สามารถโหลดข้อมูลพนักงานได้")
      }
    }

    fetchIngredients()
    fetchEmployees()
  }, [])

  // ฟังก์ชันเพิ่ม/ลดจำนวน
  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1)

  // ฟังก์ชันบันทึกการเบิกสินค้า
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedIngredient) {
      toast.error("กรุณาเลือกวัตถุดิบ")
      return
    }

    if (quantity <= 0) {
      toast.error("จำนวนต้องมากกว่า 0")
      return
    }

    if (!selectedEmployee) {
      toast.error("กรุณาเลือกพนักงาน")
      return
    }

    try {
      setLoading(true)
      
      // สร้าง FormData object
      const formData = new FormData()
      formData.append("empID", selectedEmployee)
      formData.append("stockID", selectedIngredient.stockID.toString())
      formData.append("quantity", quantity.toString())
      formData.append("unit", selectedIngredient.Unit)
      formData.append("note", note)

      // เรียกใช้ฟังก์ชัน outStock โดยตรง
      const result = await outStock(formData)

      if (!result) {
        throw new Error("เกิดข้อผิดพลาดในการเบิกสินค้า")
      }

      toast.success("เบิกสินค้าสำเร็จ")
      
      setTimeout(() => {
        router.push("/admin/stockout")
      }, 1500)
      
    } catch (error) {
      console.error("Error creating stockout:", error)
      toast.error(error.message || "เกิดข้อผิดพลาดในการเบิกสินค้า")
    } finally {
      setLoading(false)
    }
  }

  // ฟังก์ชันรับค่าพนักงานที่เลือก
  const handleSelectEmployee = (value) => {
    setSelectedEmployee(value)
  }

  return (
    <Admintemplate>
      <Toaster richColors position="top-right" />
      
      <div className="w-full h-full p-6 md:p-10">
        <div className="max-w-3xl mx-auto">
          {/* Header with back button */}
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.push("/admin/stockout")}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">เบิกสินค้าใหม่</h1>
              <p className="text-muted-foreground">บันทึกการเบิกวัตถุดิบออกจากคลัง</p>
            </div>
          </div>

          <Card className="border-none shadow-md">
            <CardHeader className="bg-[#FFF5F9] rounded-t-lg border-b pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <ArrowLeftRight className="h-5 w-5 text-[#FFB8DA]" />
                แบบฟอร์มเบิกสินค้า
              </CardTitle>
              <CardDescription>
                กรอกข้อมูลให้ครบถ้วนเพื่อบันทึกการเบิกสินค้า
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6 pb-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* เลือกพนักงาน (เพิ่มส่วนนี้) */}
                <div className="space-y-2">
                  <Label htmlFor="employee" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    เลือกพนักงาน <span className="text-red-500">*</span>
                  </Label>
                  <ComboBoxCus onSelect={handleSelectEmployee} />
                </div>

                {/* เลือกวัตถุดิบ */}
                <div className="space-y-2">
                  <Label htmlFor="ingredient" className="flex items-center gap-2">
                    <Package2 className="h-4 w-4 text-muted-foreground" />
                    เลือกวัตถุดิบ <span className="text-red-500">*</span>
                  </Label>
                  
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between h-10 px-3 py-2 text-left font-normal"
                      >
                        {selectedIngredient ? (
                          <div className="flex items-center">
                            <span>{selectedIngredient.ingredientName}</span>
                            <span className="ml-2 text-xs text-muted-foreground">
                              (คงเหลือ: {selectedIngredient.Quantity} {selectedIngredient.Unit})
                            </span>
                          </div>
                        ) : (
                          "เลือกวัตถุดิบ..."
                        )}
                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput 
                          placeholder="ค้นหาวัตถุดิบ..." 
                          value={searchValue}
                          onValueChange={setSearchValue}
                        />
                        <CommandList>
                          <CommandEmpty>ไม่พบวัตถุดิบที่ค้นหา</CommandEmpty>
                          <CommandGroup>
                            {ingredients.map((ingredient) => (
                              <CommandItem
                                key={ingredient.stockID}
                                value={ingredient.ingredientName}
                                onSelect={() => {
                                  setSelectedIngredient(ingredient)
                                  setOpen(false)
                                  setSearchValue("")
                                }}
                              >
                                <div className="flex flex-col">
                                  <span>{ingredient.ingredientName}</span>
                                  <span className="text-xs text-muted-foreground">
                                    คงเหลือ: {ingredient.Quantity} {ingredient.Unit}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  
                  {selectedIngredient && (
                    <div className="mt-2 p-3 bg-[#FFF5F9] rounded-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{selectedIngredient.ingredientName}</p>
                          <p className="text-sm text-muted-foreground">
                            รหัส: {selectedIngredient.stockID}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">คงเหลือ</p>
                          <p className="font-medium">
                            {selectedIngredient.Quantity} {selectedIngredient.Unit}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* จำนวนที่ต้องการเบิก */}
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="flex items-center gap-2">
                    <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                    จำนวนที่ต้องการเบิก <span className="text-red-500">*</span>
                  </Label>
                  
                  <div className="flex items-center">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      onClick={decrementQuantity}
                      className="rounded-r-none"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      required
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      onClick={incrementQuantity}
                      className="rounded-l-none"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    
                    <span className="ml-3 text-muted-foreground">
                      {selectedIngredient ? selectedIngredient.Unit : "หน่วย"}
                    </span>
                  </div>
                  
                  {selectedIngredient && quantity > selectedIngredient.Quantity && (
                    <p className="text-red-500 text-sm mt-1">
                      ⚠️ จำนวนที่เบิกมากกว่าจำนวนคงเหลือในคลัง
                    </p>
                  )}
                </div>

                {/* หมายเหตุ */}
                <div className="space-y-2">
                  <Label htmlFor="note" className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    หมายเหตุ
                  </Label>
                  <Textarea
                    id="note"
                    placeholder="ระบุหมายเหตุหรือวัตถุประสงค์ในการเบิก (ถ้ามี)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </form>
            </CardContent>
            
            <CardFooter className="flex justify-between pt-2 pb-6">
              <Button 
                variant="outline" 
                onClick={() => router.push("/admin/stockout")}
                disabled={loading}
              >
                ยกเลิก
              </Button>
              <Button 
                onClick={handleSubmit}
                className="bg-[#FFB8DA] hover:bg-[#fcc6e0] text-black font-medium px-6"
                disabled={loading || !selectedIngredient || !selectedEmployee}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    บันทึกการเบิก
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {/* คำแนะนำ */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="text-sm font-medium text-blue-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              คำแนะนำการเบิกสินค้า
            </h3>
            <ul className="mt-2 text-sm text-blue-700 space-y-1 pl-5 list-disc">
              <li>เลือกพนักงานผู้เบิกวัตถุดิบ</li>
              <li>เลือกวัตถุดิบที่ต้องการเบิกจากรายการ</li>
              <li>ระบุจำนวนที่ต้องการเบิกให้ถูกต้อง</li>
              <li>ระบุหมายเหตุหรือวัตถุประสงค์ในการเบิกเพื่อการตรวจสอบย้อนหลัง</li>
              <li>ตรวจสอบข้อมูลให้ถูกต้องก่อนกดบันทึก</li>
            </ul>
          </div>
        </div>
      </div>
    </Admintemplate>
  )
}

export default AddStockoutPage