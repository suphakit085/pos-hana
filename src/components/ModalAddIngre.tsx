"use client"

import { useState } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addStock } from '@/actions/actions';
import { Plus, Package, Save, X, AlertCircle, Upload } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from 'sonner';

interface ModalAddIngreProps {
    closemodal: () => void;
}

function ModalAddIngre({ closemodal }: ModalAddIngreProps) {
    const [ingredientName, setIngredientName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');
    const [price, setPrice] = useState('');
    const [minQuantity, setMinQuantity] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!ingredientName || !quantity || !unit || !price) {
            toast.error("กรุณากรอกข้อมูลให้ครบถ้วน", {
                description: "ชื่อวัตถุดิบ, จำนวน, หน่วย และราคาเป็นข้อมูลที่จำเป็น",
                icon: <AlertCircle className="h-5 w-5 text-red-500" />,
            });
            return;
        }

        try {
            setLoading(true);
            
            // 1. อัพโหลดรูปภาพก่อน
            let imageUrl = '';
            if (imageFile) {
                const imageFormData = new FormData();
                imageFormData.append('file', imageFile);
                
                const uploadResponse = await fetch('/api/upload', {
                    method: 'POST',
                    body: imageFormData
                });
                
                const uploadResult = await uploadResponse.json();
                if (uploadResult.success) {
                    imageUrl = uploadResult.imageUrl;
                } else {
                    throw new Error(uploadResult.message || 'การอัพโหลดรูปภาพล้มเหลว');
                }
            }
            
            // 2. สร้าง FormData สำหรับข้อมูลวัตถุดิบ
            const formData = new FormData();
            formData.append('ingredientName', ingredientName);
            formData.append('quantity', quantity);
            formData.append('unit', unit);
            formData.append('price', price);
            formData.append('minQuantity', minQuantity || '0');
            formData.append('category', category);
            formData.append('imageUrl', imageUrl); // เพิ่ม imageUrl ที่ได้จากการอัพโหลด
            
            // 3. เรียกใช้ addStock
            await addStock(formData);
            
            toast.success("เพิ่มวัตถุดิบใหม่สำเร็จ");
            closemodal();
            
        } catch (error) {
            toast.error("เกิดข้อผิดพลาด", {
                description: error instanceof Error ? error.message : "ไม่สามารถเพิ่มวัตถุดิบได้"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all">
            {/* ส่วนหัว */}
            <div className="bg-[#FFB8DA] hover:bg-[#fcc6e0] p-6 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Plus className="h-6 w-6" />
                        <h2 className="text-2xl font-bold">เพิ่มวัตถุดิบใหม่</h2>
                    </div>
                    <button 
                        onClick={closemodal}
                        className="text-white hover:text-pink-200 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* เนื้อหา */}
            <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* ส่วนข้อมูลวัตถุดิบ */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex gap-6">
                            <div className="flex-1">
                                <Label htmlFor="ingredientName" className="text-sm font-medium text-gray-700">
                                    ชื่อวัตถุดิบ <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="ingredientName"
                                    placeholder="กรอกชื่อวัตถุดิบ"
                                    value={ingredientName}
                                    onChange={(e) => setIngredientName(e.target.value)}
                                    required
                                    className="mt-1 focus:ring-2 focus:ring-pink-400"
                                />
                            </div>
                            
                            
                        </div>

                        <div className="flex gap-6">
                            <div className="flex-1">
                                <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                                    จำนวน <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    type="number"
                                    id="quantity"
                                    placeholder="0"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="mt-1 focus:ring-2 focus:ring-pink-400"
                                />
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="unit" className="text-sm font-medium text-gray-700">
                                    หน่วย <span className="text-red-500">*</span>
                                </Label>
                                <Select value={unit} onValueChange={setUnit} required>
                                    <SelectTrigger className="mt-1 focus:ring-2 focus:ring-pink-400">
                                        <SelectValue placeholder="เลือกหน่วย..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ชิ้น">ชิ้น</SelectItem>
                                        <SelectItem value="กิโลกรัม">กิโลกรัม</SelectItem>
                                        <SelectItem value="กรัม">กรัม</SelectItem>
                                        <SelectItem value="ลิตร">ลิตร</SelectItem>
                                        <SelectItem value="มิลลิลิตร">มิลลิลิตร</SelectItem>
                                        <SelectItem value="แพ็ค">แพ็ค</SelectItem>
                                        <SelectItem value="กล่อง">กล่อง</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="flex-1">
                                <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                                    ราคาต่อหน่วย (บาท) <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    type="number"
                                    id="price"
                                    placeholder="0.00"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="mt-1 focus:ring-2 focus:ring-pink-400"
                                />
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="minQuantity" className="text-sm font-medium text-gray-700">
                                    จำนวนขั้นต่ำ
                                </Label>
                                <Input
                                    type="number"
                                    id="minQuantity"
                                    placeholder="0"
                                    value={minQuantity}
                                    onChange={(e) => setMinQuantity(e.target.value)}
                                    min="0"
                                    className="mt-1 focus:ring-2 focus:ring-pink-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ส่วนอัพโหลดรูปภาพ */}
                    <div className="md:col-span-2">
                        <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
                            <CardContent className="p-4 flex items-center justify-center">
                                {imagePreview ? (
                                    <div className="relative w-full h-[200px]">
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            className="w-full h-full object-contain rounded-lg"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                            onClick={() => {
                                                setImagePreview(null);
                                                setImageFile(null);
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <Upload className="h-6 w-6 text-gray-400" />
                                        <div>
                                            <Label 
                                                htmlFor="image-upload" 
                                                className="text-pink-500 hover:text-pink-600 cursor-pointer"
                                            >
                                                อัพโหลดรูปภาพ
                                            </Label>
                                            <p className="text-sm text-gray-500">
                                                (ไม่บังคับ)
                                            </p>
                                        </div>
                                        <Input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* ปุ่มดำเนินการ */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={closemodal}
                        className="w-full sm:w-auto border-gray-300 hover:bg-gray-100"
                    >
                        ยกเลิก
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto bg-[#FFB8DA] hover:bg-[#fcc6e0] hover:from-pink-600 hover:to-purple-700 text-white"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                กำลังบันทึก...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <Save className="h-4 w-4 mr-2" />
                                บันทึกข้อมูล
                            </span>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default ModalAddIngre;