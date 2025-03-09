"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"; //เอาไว้ใช้ส่งข้อมูล API
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




export function ComboboxIngredien() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [selectedLabel, setSelectedLabel] = React.useState("") 
  const [selectedStockID, setSelectedStockID] = React.useState("") // เพิ่ม state สำหรับเก็บ stockID
  const [ingredientNames, setIngredientNames] = useState([]); // เปลี่ยนชื่อให้ชัดเจนขึ้น
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadFoods = async () => {
      try {
        setIsLoading(true)
        const res = await fetch("/api/stock")
        const data = await res.json()
        // ตรวจสอบว่า data เป็น array และมีข้อมูล
        if (Array.isArray(data)) {
          const formattedFoods = data.map(item => ({
            value: item.stockID.toString(),
            label: item.ingredientName
          }))
          setIngredientNames(formattedFoods)
        } else {
          console.error("Data is not an array:", data)
          setIngredientNames([])
        }
      } catch (error) {
        console.error("Error loading foods:", error)
        setIngredientNames([])
      } finally {
        setIsLoading(false)
      }
    }

    

    loadFoods()
  }, [])

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value && ingredientNames.length > 0
              ? `${value} - ${ingredientNames.find((item) => item.value === value)?.label}` 
              : "เลือกวัตถุดิบ..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0"> {/* เพิ่มความกว้างเป็น 300px */}
          <Command>
            <CommandInput placeholder="ค้นหาวัตถุดิบ..." className="h-9"/>
            <CommandList>
              <CommandEmpty>ไม่พบรายการวัตถุดิบ</CommandEmpty>
              <CommandGroup>
                {isLoading ? (
                  <CommandItem disabled>กำลังโหลด...</CommandItem>
                ) : (
                  ingredientNames.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue)
                        const selected = ingredientNames.find(i => i.value === currentValue)
                        setSelectedLabel(selected?.label || "")
                        setSelectedStockID(selected?.value || "")
                        setOpen(false)
                      }}
                    >
                      <span className="flex gap-2">
                        <span className="text-gray-500">#{item.value}</span>
                        <span>{item.label}</span>
                      </span>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === item.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <input 
        type="hidden" 
        name="stockID" 
        value={selectedStockID}
      />
      <input 
        type="hidden" 
        name="ingredientName" 
        value={selectedLabel}
      />
    </>
  )
}
  
