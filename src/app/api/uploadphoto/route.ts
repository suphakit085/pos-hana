import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import prisma from "../../../utils/db";

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;
        const stockId = data.get('stockId');

        if (!file) {
            return NextResponse.json({ success: false, message: "ไม่พบไฟล์" });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // สร้างชื่อไฟล์ที่ไม่ซ้ำกัน
        const timestamp = Date.now();
        const filename = `stock-${stockId}-${timestamp}${path.extname(file.name)}`;

        // บันทึกไฟล์ในโฟลเดอร์ public
        const filepath = path.join(process.cwd(), 'public/uploads', filename);
        await writeFile(filepath, buffer);

        // สร้าง URL สำหรับเข้าถึงรูปภาพ
        const imageUrl = `/uploads/${filename}`;

        // อัพเดท URL ในฐานข้อมูล
        await prisma.stock.update({
            where: { stockID: Number(stockId) },
            data: { imageUrl }
        });

        return NextResponse.json({ success: true, imageUrl });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}