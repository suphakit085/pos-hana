'use client'

import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';
import ComboBoxCus from '../combobox/ComboBoxCus';
import { createStockInWithDetails } from '@/actions/actions';
import { ComboboxIngredien } from '../combobox/ComboBoxIngrediens';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from 'react';
import { StockInItem } from '@/utils/types';


export default function StockInDetailAdd() {
    const router = useRouter();
    const [items, setItems] = useState<StockInItem[]>([]);
    const [quantity, setQuantity] = useState<number>(0);
    const [pricePerUnit, setPricePerUnit] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [selectedUnit, setSelectedUnit] = useState('');
    const [grandTotal, setGrandTotal] = useState<number>(0);
    const [note, setNote] = useState<string>('');

    // คำนวณราคารวมต่อรายการ
    useEffect(() => {
        setTotalPrice(quantity * pricePerUnit);
    }, [quantity, pricePerUnit]);

    // เพิ่มรายการใหม่เข้า items array
    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        
        const newItem: StockInItem = {
            stockID: parseInt(formData.get("stockID") as string),
            ingredientName: formData.get("ingredientName") as string,
            quantity: quantity,
            unit: selectedUnit,
            pricePerUnit: pricePerUnit,
            totalPrice: totalPrice
        };

        setItems(prev => [...prev, newItem]);
        setGrandTotal(prev => prev + totalPrice);
        
        // รีเซ็ตฟอร์ม
        setQuantity(0);
        setPricePerUnit(0);
        setSelectedUnit('');
        setTotalPrice(0);
        (e.target as HTMLFormElement).reset();
    };

    // บันทึกทั้งหมดลงฐานข้อมูล
    const handleSaveAll = async () => {
        try {
            const formElement = document.querySelector('form') as HTMLFormElement;
            const formData = new FormData();
            
            // ตรวจสอบ empID จาก form element
            const empID = formElement.querySelector('input[name="empID"]')?.value;
            if (!empID) {
                toast.error("กรุณาเลือกพนักงาน");
                return;
            }
    
            // ใส่ข้อมูลที่จำเป็นใน FormData
            formData.append("empID", empID);
            formData.append("totalPrice", grandTotal.toString());
            formData.append("items", JSON.stringify(items));
            formData.append("note", note); // เพิ่ม note

            await createStockInWithDetails(formData);
            toast.success("บันทึกข้อมูลสำเร็จ");
            router.push('/stock');
        } catch (error) {
            toast.error("เกิดข้อผิดพลาด: " + (error as Error).message);
        }
    };

    return (
        <>
        {items.length > 0 && (
                <div className="border p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">รายการที่เพิ่มแล้ว</h3>
                    {items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm py-2 border-b">
                            <span>{item.ingredientName}</span>
                            <span>{item.quantity} {item.unit}</span>
                            <span>{item.totalPrice} บาท</span>
                        </div>
                    ))}
                    <div className="mt-4 text-right font-semibold">
                        ราคารวมทั้งหมด: {grandTotal} บาท
                    </div>
                </div>
            )}
        
        <div className="space-y-6">
            <form onSubmit={handleAddItem} className="space-y-6">
                <div className="space-y-4">

                    
                    <div>
                        <Label>วัตถุดิบ</Label>
                        <ComboboxIngredien />
                    </div>

                    <div>
                        <Label htmlFor="quantity">จำนวน</Label>
                        <Input 
                            id="quantity" 
                            name="quantity" 
                            type="number" 
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            required 
                        />
                    </div>

                    <div>
                        <Label htmlFor="unit">หน่วย</Label>
                        <Select onValueChange={setSelectedUnit} value={selectedUnit}>
                            <SelectTrigger>
                                <SelectValue placeholder="เลือกหน่วย" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="kg">กิโลกรัม (กก.)</SelectItem>
                                <SelectItem value="g">กรัม (ก.)</SelectItem>
                                <SelectItem value="piece">ชิ้น</SelectItem>
                                <SelectItem value="pack">แพ็ค</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input type="hidden" name="unit" value={selectedUnit} />
                    </div>

                    <div>
                        <Label htmlFor="pricePerunit">ราคาต่อหน่วย</Label>
                        <Input 
                            id="pricePerunit" 
                            name="pricePerunit" 
                            type="number" 
                            value={pricePerUnit}
                            onChange={(e) => setPricePerUnit(Number(e.target.value))}
                            required 
                        />
                    </div>

                    <div>
                        <Label htmlFor="totalPrice">ราคารวม</Label>
                        <Input 
                            id="totalPrice" 
                            name="totalPrice" 
                            type="number" 
                            value={totalPrice}
                            readOnly 
                        />
                    </div>

                    <div>
                        <ComboBoxCus />
                    </div>
                    <div>
                    <Label htmlFor="note">หมายเหตุ</Label>
                    <textarea
                        id="note"
                        name="note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full min-h-[100px] p-2 border rounded-md"
                        placeholder="เพิ่มหมายเหตุ (ถ้ามี)"
                    />
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button type="submit" className="flex-1">
                        เพิ่มรายการ
                    </Button>
                    {items.length > 0 && (
                        <Button 
                            type="button" 
                            onClick={handleSaveAll} 
                            className="flex-1"
                        >
                            บันทึกทั้งหมด
                        </Button>
                    )}
                    <Button type="button" variant="outline" className="flex-1">
                        <Link href="/stock">ยกเลิก</Link>
                    </Button>
                </div>
            </form>
         </div>
        </>
    );
}