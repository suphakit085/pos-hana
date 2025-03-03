"use client"

import { Button } from './ui/button';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"



interface ModalAddIngreProps {
    closemodal: () => void;
}

function ModalAddIngre({ closemodal }: ModalAddIngreProps) {


    const [foodType, setFoodType] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');


    return (
        <>
            <div className="w-[600px] h-auto border-2 rounded-xl p-6 bg-white">
                <div className="w-full h-[60px] flex items-center">
                    <p className="text-3xl">เพิ่มวัตถุดิบใหม่</p>
                </div>

                <div>

                    <div className='mt-5'>
                        <div className="mb-4 ">
                            <label htmlFor="food-type" className="block text-sm font-medium text-gray-700">
                                ชื่อวัตถุดิบ
                            </label>
                            <input
                                type="text"
                                id="quantity"
                                placeholder='กรอกชื่อวัตถุดิบ'
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#FFB8DA] focus:border-[#FFB8DA] sm:text-sm"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>
                    </div>

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

                    <div className="grid grid-cols-2 gap-4 mt-10">
                        <Button className="w-full h-[40px] bg-[#FFB8DA] hover:bg-[#fcc6e0] " type='submit' onClick={closemodal}>
                            บันทึก
                        </Button>
                        <Button variant="outline" className="w-full h-[40px]" onClick={closemodal}>
                            ยกเลิก
                        </Button>
                    </div>
                </div>
            </div>

        </>
    );
}

export default ModalAddIngre;