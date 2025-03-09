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
import { useState, useEffect } from "react"

interface Ingredient {
  stockID: number
  ingredientName: string
  Quantity: number
  Unit: string
}

interface ComboboxIngredienProps {
  onSelect?: (ingredient: { id: number, name: string }) => void
}

export function ComboboxIngredien({ onSelect }: ComboboxIngredienProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchValue, setSearchValue] = useState("")

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/stock')
        if (!response.ok) {
          throw new Error('Failed to fetch ingredients')
        }
        
        const data = await response.json()
        setIngredients(data)
      } catch (error) {
        console.error('Error fetching ingredients:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchIngredients()
  }, [])

  // จัดการการเลือกและแจ้งคอมโพเนนต์หลัก
  const handleSelect = (currentValue: string, ingredientName: string) => {
    setValue(currentValue === value ? "" : currentValue)
    setOpen(false)
    
    if (currentValue !== value && onSelect) {
      const selectedIngredient = ingredients.find(
        i => i.stockID === parseInt(currentValue)
      )
      
      if (selectedIngredient) {
        onSelect({
          id: selectedIngredient.stockID,
          name: selectedIngredient.ingredientName
        })
      }
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
            disabled={loading}
          >
            {loading ? (
              "กำลังโหลด..."
            ) : value ? (
              ingredients.find((item) => item.stockID.toString() === value)?.ingredientName
            ) : (
              "เลือกวัตถุดิบ..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start" side="bottom">
          <Command>
            <CommandInput 
              placeholder="ค้นหาวัตถุดิบ..." 
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>ไม่พบวัตถุดิบที่ค้นหา</CommandEmpty>
              <CommandGroup>
                {ingredients
                  .filter(item => 
                    item.ingredientName.toLowerCase().includes(searchValue.toLowerCase())
                  )
                  .map((item) => (
                    <CommandItem
                      key={item.stockID}
                      value={item.stockID.toString()}
                      onSelect={(currentValue) => 
                        handleSelect(currentValue, item.ingredientName)
                      }
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === item.stockID.toString() ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="flex-1">
                        {item.ingredientName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        คงเหลือ: {item.Quantity} {item.Unit}
                      </span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <input type="hidden" name="stockID" value={value} />
      <input 
        type="hidden" 
        name="ingredientName" 
        value={ingredients.find(item => item.stockID.toString() === value)?.ingredientName || ''} 
      />
    </div>
  )
}