"use client"

import { Button } from './ui/button';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

interface ModalAddProductProps {
    closemodal: () => void;
}

function ModalAddProduct({ closemodal }: ModalAddProductProps) {
    const [foodType, setFoodType] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [products, setProducts] = useState([
        {
            id: "1",
            name: "เนื้อออสเตรเลีย",
            amount: "70",
            unit: "KG",
            emp: "Thitikorn",
            status: "ปกติ",
            dateupdate: "20-11-2025 18:00",
            note: "",
        },
    ]);

    const handleAddProduct = () => {
        const newProduct = {
            id: Date.now().toString(),
            name: foodType,
            amount: quantity,
            unit: unit,
            emp: "Thitikorn", // ค่าเริ่มต้นหรือกรอกข้อมูลพนักงาน
            status: "ปกติ", // สถานะเริ่มต้น
            dateupdate: new Date().toLocaleString(),
            note: "", // เพิ่มหมายเหตุถ้าต้องการ
        };

        setProducts((prev) => [...prev, newProduct]);
        // รีเซ็ตฟอร์ม
        setFoodType('');
        setQuantity('');
        setUnit('');
        setPrice('');
        setCategory('');
    };

    const handleDeleteProduct = (productId: string) => {
        setProducts((prev) => prev.filter((product) => product.id !== productId));
    };

    return (
        <>
            <div className="w-[600px] h-auto border-2 rounded-xl p-6 bg-white">
                <div className="w-full mb-3 h-[60px] flex items-center">
                    <p className="text-3xl">เพิ่มสินค้าใหม่</p>
                </div>

                {/* ตารางแสดง */}
                {products.length > 0 && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px] md:w-[200px]">ชื่อสินค้าที่เพิ่มแล้ว</TableHead>
                            <TableHead className="w-[100px] text-right">จำนวน</TableHead>
                            <TableHead className="w-[75px] text-right">หน่วย</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell className="text-right">{product.amount}</TableCell>
                                <TableCell className="text-right">{product.unit}</TableCell>
                                <TableCell className="flex items-center justify-around lg:justify-end">
                                    <Button variant="destructive" onClick={() => handleDeleteProduct(product.id)}>ลบ</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                )}
                <div>
                    {/* ฟอร์มกรอกข้อมูล */}
                    <div className='flex items-end mt-5'>
                        <div className="mb-4 mr-5">
                            <label htmlFor="food-type" className="block text-sm font-medium text-gray-700">
                                เลือกอาหาร...
                            </label>
                            <Select value={foodType} onValueChange={setFoodType}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="เลือกอาหาร..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="อาหารสำเร็จรูป">อาหารสำเร็จรูป</SelectItem>
                                    <SelectItem value="เครื่องดื่ม">เครื่องดื่ม</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* ฟอร์มจำนวนและหน่วย */}
                    <div className="grid grid-cols-2 gap-4 mb-4 items-end">
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                                จำนวน
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                placeholder="0"
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#FFB8DA] focus:border-[#FFB8DA] sm:text-sm"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                                หน่วย
                            </label>
                            <Select value={unit} onValueChange={setUnit}>
                                <SelectTrigger className="w-full h-[40px]">
                                    <SelectValue placeholder="เลือกหน่วย..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ชิ้น">ชิ้น</SelectItem>
                                    <SelectItem value="กิโลกรัม">กิโลกรัม</SelectItem>
                                    <SelectItem value="กรัม">กรัม</SelectItem>
                                    <SelectItem value="ลิตร">ลิตร</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* ฟอร์มราคาต่อหน่วยและหมวดหมู่ */}
                    <div className="grid grid-cols-2 gap-4 mb-4 items-end">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                ราคาต่อหน่วย (บาท)
                            </label>
                            <input
                                type="number"
                                id="price"
                                placeholder="0.00"
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#FFB8DA] focus:border-[#FFB8DA] sm:text-sm"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                หมวดหมู่
                            </label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="w-full h-[40px]">
                                    <SelectValue placeholder="เลือกหมวดหมู่..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ผัก">ผัก</SelectItem>
                                    <SelectItem value="ผลไม้">ผลไม้</SelectItem>
                                    <SelectItem value="เนื้อสัตว์">เนื้อสัตว์</SelectItem>
                                    <SelectItem value="เครื่องปรุง">เครื่องปรุง</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* ปุ่มต่างๆ */}
                    <div className="grid grid-cols-3 gap-4 mt-10">
                        <Button
                            className="w-full h-[40px] bg-[#FFB8DA] hover:bg-[#fcc6e0]"
                            type="button"
                            onClick={handleAddProduct} // เพิ่มสินค้าลงในตาราง
                        >
                            เพิ่มรายการ
                        </Button>
                        {products.length > 0 && (
                            <Button
                                className="w-full h-[40px] bg-[#FFB8DA] hover:bg-[#fcc6e0]"
                                type="button"
                            >
                                บันทึกข้อมูลทั้งหมด
                            </Button>
                        )}
                        <Button variant="outline" className="w-full h-[40px]" onClick={closemodal}>
                            ยกเลิก
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ModalAddProduct;
