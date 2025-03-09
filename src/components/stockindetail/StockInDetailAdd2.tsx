'use client'

import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createStockInWithDetails } from '@/actions/actions';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';
import ComboBoxCus from '@/components/combobox/ComboBoxCus';
import { ComboboxIngredien } from '@/components/combobox/ComboBoxIngredien';

// กำหนดประเภทข้อมูลสำหรับสินค้า
interface StockInItem {
    id?: string;
    stockID: number;
    ingredientName: string;
    quantity: number;
    unit: string;
    pricePerUnit: number;
    totalPrice: number;
}

export default function StockInDetailAdd() {
    const router = useRouter();
    const [items, setItems] = useState<StockInItem[]>([]);
    const [quantity, setQuantity] = useState<number>(0);
    const [pricePerUnit, setPricePerUnit] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [selectedUnit, setSelectedUnit] = useState('');
    const [grandTotal, setGrandTotal] = useState<number>(0);
    const [note, setNote] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedIngredient, setSelectedIngredient] = useState<{ id: number, name: string } | null>(null);

    // คำนวณราคารวมของสินค้าปัจจุบัน
    useEffect(() => {
        setTotalPrice(quantity * pricePerUnit);
    }, [quantity, pricePerUnit]);

    // เพิ่มสินค้าใหม่ลงในรายการ
    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedIngredient) {
            toast.error("กรุณาเลือกวัตถุดิบ");
            return;
        }

        if (!selectedUnit) {
            toast.error("กรุณาเลือกหน่วย");
            return;
        }

        if (quantity <= 0) {
            toast.error("จำนวนต้องมากกว่า 0");
            return;
        }

        if (pricePerUnit <= 0) {
            toast.error("ราคาต้องมากกว่า 0");
            return;
        }

        const newItem: StockInItem = {
            id: Date.now().toString(), // ID ที่ไม่ซ้ำกันสำหรับแต่ละรายการ
            stockID: selectedIngredient.id,
            ingredientName: selectedIngredient.name,
            quantity: quantity,
            unit: selectedUnit,
            pricePerUnit: pricePerUnit,
            totalPrice: totalPrice
        };

        setItems(prev => [...prev, newItem]);
        setGrandTotal(prev => prev + totalPrice);

        // รีเซ็ตฟอร์ม
        setSelectedIngredient(null);
        setQuantity(0);
        setPricePerUnit(0);
        setSelectedUnit('');
        setTotalPrice(0);

        toast.success(`เพิ่ม ${newItem.ingredientName} เรียบร้อยแล้ว`);
    };

    // ลบสินค้าออกจากรายการ
    const handleRemoveItem = (itemId: string) => {
        const itemToRemove = items.find(item => item.id === itemId);
        if (itemToRemove) {
            setItems(prev => prev.filter(item => item.id !== itemId));
            setGrandTotal(prev => prev - itemToRemove.totalPrice);
            toast.info(`ลบ ${itemToRemove.ingredientName} ออกแล้ว`);
        }
    };

    // จัดการกับการเลือกวัตถุดิบจาก combobox
    const handleIngredientSelect = (ingredient: { id: number, name: string }) => {
        setSelectedIngredient(ingredient);
    };

    // ส่งข้อมูลทั้งหมดไปยังฐานข้อมูล
    // เพิ่ม console.log เพื่อดูว่าฟังก์ชันถูกเรียกหรือไม่
    const handleSaveAll = async () => {
        if (items.length === 0) {
          toast.error("กรุณาเพิ่มรายการอย่างน้อย 1 รายการ");
          return;
        }
      
        try {
          setLoading(true);
      
          // สร้าง FormData ใหม่
          const formData = new FormData();
      
          // รับ ID พนักงานจากฟอร์ม
          const empInput = document.querySelector('input[name="empID"]') as HTMLInputElement;
          const empID = empInput?.value;
      
          console.log("Employee ID element:", empInput);
          console.log("Employee ID value:", empID);
      
          if (!empID) {
            toast.error("กรุณาเลือกพนักงาน");
            setLoading(false);
            return;
          }
      
          // เพิ่มข้อมูลลงใน FormData
          formData.append("empID", empID);
          formData.append("totalPrice", grandTotal.toString());
      
          // แปลงข้อมูลสินค้า
          const itemsData = items.map(item => ({
            stockID: item.stockID,
            ingredientName: item.ingredientName,
            quantity: Number(item.quantity), // แน่ใจว่าเป็น number
            unit: item.unit,
            pricePerUnit: Number(item.pricePerUnit), // แน่ใจว่าเป็น number
            totalPrice: Number(item.totalPrice) // แน่ใจว่าเป็น number
          }));
      
          console.log("Items data before JSON:", itemsData);
          const itemsJSON = JSON.stringify(itemsData);
          console.log("Items JSON after stringify:", itemsJSON);
          
          formData.append("items", itemsJSON);
          formData.append("note", note);
      
          // ใช้ API fetch แทน server action โดยตรง
          const response = await fetch('/api/stockin', {
            method: 'POST',
            body: formData
          });
      
          const responseText = await response.text();
          console.log("Raw response:", responseText);
          
          let result;
          try {
            result = JSON.parse(responseText);
          } catch (e) {
            console.error("Failed to parse response:", e);
            throw new Error("รูปแบบข้อมูลตอบกลับไม่ถูกต้อง");
          }
      
          if (!response.ok) {
            throw new Error(result.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
          }
      
          console.log("Result:", result);
      
          toast.success("บันทึกข้อมูลสำเร็จ");
          router.push('/admin/stockin');
        } catch (error) {
          console.error("Error in handleSaveAll:", error);
          toast.error("เกิดข้อผิดพลาด: " + (error instanceof Error ? error.message : String(error)));
        } finally {
          setLoading(false);
        }
      };

    return (
        <div className="space-y-8">
            {/* แสดงรายการที่เพิ่มแล้ว */}
            {items.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>วัตถุดิบ</TableHead>
                                <TableHead>จำนวน</TableHead>
                                <TableHead>หน่วย</TableHead>
                                <TableHead className="text-right">ราคาต่อหน่วย</TableHead>
                                <TableHead className="text-right">ราคารวม</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.ingredientName}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{item.unit}</TableCell>
                                    <TableCell className="text-right">{item.pricePerUnit.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">{item.totalPrice.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveItem(item.id!)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="p-4 bg-muted/50 flex justify-between items-center border-t">
                        <span className="font-medium">รวมทั้งสิ้น {items.length} รายการ</span>
                        <span className="text-lg font-bold">฿{grandTotal.toFixed(2)}</span>
                    </div>
                </div>
            )}

            {/* ฟอร์มเพิ่มสินค้าใหม่ */}
            <div className="bg-card border rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-medium mb-4">เพิ่มรายการนำเข้า</h3>
                <form onSubmit={handleAddItem} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="ingredient">วัตถุดิบ <span className="text-red-500">*</span></Label>
                            <ComboboxIngredien onSelect={handleIngredientSelect} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="unit">หน่วย <span className="text-red-500">*</span></Label>
                            <Select onValueChange={setSelectedUnit} value={selectedUnit}>
                                <SelectTrigger id="unit">
                                    <SelectValue placeholder="เลือกหน่วย" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="kg">กิโลกรัม (กก.)</SelectItem>
                                    <SelectItem value="g">กรัม (ก.)</SelectItem>
                                    <SelectItem value="piece">ชิ้น</SelectItem>
                                    <SelectItem value="pack">แพ็ค</SelectItem>
                                    <SelectItem value="bottle">ขวด</SelectItem>
                                    <SelectItem value="box">กล่อง</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quantity">จำนวน <span className="text-red-500">*</span></Label>
                            <Input
                                id="quantity"
                                type="number"
                                step="0.01"
                                min="0"
                                value={quantity || ''}
                                onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                                placeholder="0.00"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pricePerUnit">ราคาต่อหน่วย (บาท) <span className="text-red-500">*</span></Label>
                            <Input
                                id="pricePerUnit"
                                type="number"
                                step="0.01"
                                min="0"
                                value={pricePerUnit || ''}
                                onChange={(e) => setPricePerUnit(parseFloat(e.target.value) || 0)}
                                placeholder="0.00"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="totalPrice">ราคารวม (บาท)</Label>
                            <Input
                                id="totalPrice"
                                type="number"
                                value={totalPrice.toFixed(2)}
                                readOnly
                                className="bg-muted"
                            />
                        </div>

                        <div className="flex items-end">
                            <Button type="submit" className="w-full bg-[#FFB8DA] hover:bg-[#fcc6e0] text-black">
                                เพิ่มรายการ
                            </Button>
                        </div>
                    </div>
                </form>
            </div>

            {/* พนักงานผู้รับผิดชอบและหมายเหตุ */}
            <div className="bg-card border rounded-lg p-4 shadow-sm space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="employee">พนักงานผู้นำเข้า <span className="text-red-500">*</span></Label>
                    <ComboBoxCus onSelect={(value) => console.log("Employee selected:", value)} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="note">หมายเหตุ</Label>
                    <Textarea
                        id="note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="เพิ่มหมายเหตุ (ถ้ามี)"
                        className="min-h-[100px]"
                    />
                </div>
            </div>

            {/* ปุ่มดำเนินการ */}
            <div className="flex gap-4">
                <Button
                    onClick={handleSaveAll}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={items.length === 0 || loading}
                >
                    {loading ? 'กำลังบันทึก...' : 'บันทึกทั้งหมด'}
                </Button>
                <Button
                    variant="outline"
                    className="flex-1"
                    asChild
                >
                    <Link href="/admin/stockin">ยกเลิก</Link>
                </Button>
            </div>
        </div>
    );
}