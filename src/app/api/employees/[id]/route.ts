// src/app/api/employees/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

// GET: Fetch a specific employee by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid employee ID" },
        { status: 400 }
      );
    }
    
    const employee = await prisma.employee.findUnique({
      where: { empID: id }
    });
    
    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(employee);
  } catch (error) {
    console.error("Error fetching employee:", error);
    return NextResponse.json(
      { error: "Failed to fetch employee" },
      { status: 500 }
    );
  }
}

// PUT: Update an employee by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid employee ID" },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.empFname || !body.empLname || !body.empPhone || !body.position) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { empID: id }
    });
    
    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }
    
    // Update employee
    const updatedEmployee = await prisma.employee.update({
      where: { empID: id },
      data: {
        empFname: body.empFname,
        empLname: body.empLname,
        empPhone: body.empPhone,
        position: body.position,
        salary: body.salary || 0,
      }
    });
    
    return NextResponse.json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 }
    );
  }
}

// DELETE: Delete an employee by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid employee ID" },
        { status: 400 }
      );
    }
    
    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { empID: id }
    });
    
    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }
    
    // Check if there are any dependencies (orders, stock records, etc.)
    // This is important to prevent database integrity issues
    const hasOrders = await prisma.orders.findFirst({
      where: { Employee_empID: id }
    });
    
    const hasStockIns = await prisma.stock_In.findFirst({
      where: { Employee_empID: id }
    });
    
    const hasTimeScriptions = await prisma.timeScription.findFirst({
      where: { Employee_empID: id }
    });
    
    if (hasOrders || hasStockIns || hasTimeScriptions) {
      return NextResponse.json(
        { 
          error: "Cannot delete employee with associated records",
          details: "This employee has associated orders, stock operations, or other records. Please reassign or delete those records first."
        },
        { status: 409 }
      );
    }
    
    // Delete employee
    await prisma.employee.delete({
      where: { empID: id }
    });
    
    return NextResponse.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}