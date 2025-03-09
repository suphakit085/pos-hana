"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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

// เพิ่ม Props interface สำหรับ ComboBoxCus
interface ComboBoxCusProps {
  onSelect?: (value: string) => void;
}

export default function ComboBoxCus({ onSelect }: ComboBoxCusProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [selectedLabel, setSelectedLabel] = React.useState("")
  const [customerNames, setCustomerNames] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const loadCustomers = async () => {
      try {
        setIsLoading(true)
        const res = await fetch("/api/customer")
        const data = await res.json()
        
        if (Array.isArray(data)) {
          const formattedCustomers = data.map(item => ({
            value: item.empID.toString(),
            label: item.empFname
          }))
          setCustomerNames(formattedCustomers)
        }
      } catch (error) {
        console.error("Error loading customers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCustomers()
  }, [])

  // เมื่อ value มีการเปลี่ยนแปลง ส่งค่าไปยัง parent component
  React.useEffect(() => {
    if (onSelect && value) {
      onSelect(value);
    }
  }, [value, onSelect]);

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
            disabled={isLoading}
          >
            {isLoading ? (
              "Loading..."
            ) : value ? (
              customerNames.find((customer) => customer.value === value)?.label
            ) : (
              "เลือกพนักงาน..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="ค้นหาพนักงาน..." className="h-9" />
            <CommandList>
              <CommandEmpty>ไม่พบข้อมูล</CommandEmpty>
              <CommandGroup>
                {customerNames.map((customer) => (
                  <CommandItem
                    key={customer.value}
                    value={customer.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      setSelectedLabel(customer.label)
                      setOpen(false)
                    }}
                  > {customer.value}
                    <Check
                      className={cn(
                        "h-4 w-4",
                        value === customer.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {customer.label} 
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      <input
        type="hidden"
        name="empID"
        value={value}
      />
    </div>
  )
}