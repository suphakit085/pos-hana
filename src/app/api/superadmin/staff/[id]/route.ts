// src/app/api/employees/[id]/route.ts
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

// GET - ดึงข้อมูลพนักงานตาม ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'รหัสพนักงานไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    // ใช้ Prisma ดึงข้อมูลพนักงานตาม ID
    // const employee = await prisma.employee.findUnique({
    //   where: { empID: id },
    // });

    // สำหรับการจำลองข้อมูล
    const employee = mockEmployees.find(emp => emp.empID === id);

    if (!employee) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลพนักงาน' },
        { status: 404 }
      );
    }

    // ส่งคืนข้อมูลพนักงาน
    return NextResponse.json(employee, { status: 200 });
  } catch (error) {
    console.error('Error fetching employee:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลพนักงาน' },
      { status: 500 }
    );
  }
}

// PUT - อัปเดตข้อมูลพนักงานตาม ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const data = await request.json();

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'รหัสพนักงานไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!data.empFname || !data.empLname || !data.empPhone || !data.position || data.salary === undefined) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // ใช้ Prisma อัปเดตข้อมูลพนักงาน
    // const updatedEmployee = await prisma.employee.update({
    //   where: { empID: id },
    //   data: {
    //     empFname: data.empFname,
    //     empLname: data.empLname,
    //     empPhone: data.empPhone,
    //     position: data.position,
    //     salary: data.salary,
    //   },
    // });

    // สำหรับการจำลองข้อมูล
    const employeeIndex = mockEmployees.findIndex(emp => emp.empID === id);
    
    if (employeeIndex === -1) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลพนักงาน' },
        { status: 404 }
      );
    }

    const updatedEmployee = {
      empID: id,
      empFname: data.empFname,
      empLname: data.empLname,
      empPhone: data.empPhone,
      position: data.position,
      salary: data.salary,
    };

    // ส่งคืนข้อมูลพนักงานที่อัปเดต
    return NextResponse.json(updatedEmployee, { status: 200 });
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลพนักงาน' },
      { status: 500 }
    );
  }
}

// DELETE - ลบข้อมูลพนักงานตาม ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'รหัสพนักงานไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    // ใช้ Prisma ลบข้อมูลพนักงาน
    // await prisma.employee.delete({
    //   where: { empID: id },
    // });

    // สำหรับการจำลองข้อมูล
    const employeeIndex = mockEmployees.findIndex(emp => emp.empID === id);
    
    if (employeeIndex === -1) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลพนักงาน' },
        { status: 404 }
      );
    }

    // ส่งคืนข้อความยืนยันการลบข้อมูล
    return NextResponse.json(
      { message: 'ลบข้อมูลพนักงานเรียบร้อยแล้ว' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบข้อมูลพนักงาน' },
      { status: 500 }
    );
  }
}