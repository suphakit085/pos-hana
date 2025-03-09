import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, message: "ไม่พบไฟล์" });
        }

        // ตรวจสอบขนาดไฟล์ (5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ success: false, message: "ขนาดไฟล์ต้องไม่เกิน 5MB" });
        }

        // ตรวจสอบประเภทไฟล์
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ success: false, message: "รองรับเฉพาะไฟล์รูปภาพเท่านั้น" });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // สร้างชื่อไฟล์ที่ไม่ซ้ำกัน
        const timestamp = Date.now();
        const filename = `image-${timestamp}${path.extname(file.name)}`;
        
        // บันทึกไฟล์
        const filepath = path.join(process.cwd(), 'public/uploads', filename);
        await writeFile(filepath, buffer);
        
        const imageUrl = `/uploads/${filename}`;

        return NextResponse.json({ 
            success: true, 
            imageUrl,
            message: "อัพโหลดรูปภาพสำเร็จ" 
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ 
            success: false, 
            message: "เกิดข้อผิดพลาดในการอัพโหลด" 
        });
    }
}