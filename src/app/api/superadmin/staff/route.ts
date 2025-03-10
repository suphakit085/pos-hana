// src/app/api/employees/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ข้อมูลจำลองกรณีไม่มีการเชื่อมต่อกับฐานข้อมูล
const mockEmployees = [
  { empID: 1, empFname: 'สมชาย', empLname: 'ใจดี', empPhone: '0891234567', position: 'ผู้จัดการ', salary: 30000 },
  { empID: 2, empFname: 'สมหญิง', empLname: 'มีสุข', empPhone: '0891234568', position: 'พนักงานเสิร์ฟ', salary: 15000 },
  { empID: 3, empFname: 'วิชัย', empLname: 'เก่งกาจ', empPhone: '0891234569', position: 'พ่อครัว', salary: 25000 },
  { empID: 4, empFname: 'นารี', empLname: 'สดใส', empPhone: '0891234570', position: 'แคชเชียร์', salary: 18000 },
  { empID: 5, empFname: 'ประพันธ์', empLname: 'คล่องแคล่ว', empPhone: '0891234571', position: 'พนักงานทำความสะอาด', salary: 12000 },
];

// GET - ดึงข้อมูลพนักงานทั้งหมด
export async function GET() {
  try {
    // ใช้ Prisma ดึงข้อมูลพนักงาน
    // const employees = await prisma.employee.findMany({
    //   orderBy: { empID: 'asc' },
    // });

    // ส่งคืนข้อมูลพนักงาน
    return NextResponse.json(mockEmployees, { status: 200 });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลพนักงาน' },
      { status: 500 }
    );
  }
}

// POST - เพิ่มพนักงานใหม่
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!data.empFname || !data.empLname || !data.empPhone || !data.position || data.salary === undefined) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // เชื่อมต่อกับฐานข้อมูล Prisma
    // const newEmployee = await prisma.employee.create({
    //   data: {
    //     empFname: data.empFname,
    //     empLname: data.empLname,
    //     empPhone: data.empPhone,
    //     position: data.position,
    //     salary: data.salary,
    //   },
    // });

    // สำหรับการจำลองข้อมูล
    const newEmployee = {
      empID: mockEmployees.length > 0 ? Math.max(...mockEmployees.map(e => e.empID)) + 1 : 1,
      empFname: data.empFname,
      empLname: data.empLname,
      empPhone: data.empPhone,
      position: data.position,
      salary: data.salary,
    };

    // ส่งคืนข้อมูลพนักงานที่สร้างขึ้น
    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการเพิ่มพนักงาน' },
      { status: 500 }
    );
  }
}