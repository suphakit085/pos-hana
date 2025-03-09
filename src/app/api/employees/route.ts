// src/app/api/employees/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Fetch all employees
export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: {
        empID: 'asc'
      }
    });
    
    return NextResponse.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

// POST: Create a new employee
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.empFname || !body.empLname || !body.empPhone || !body.position) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Create new employee
    const newEmployee = await prisma.employee.create({
      data: {
        empFname: body.empFname,
        empLname: body.empLname,
        empPhone: body.empPhone,
        position: body.position,
        salary: body.salary || 0,
      }
    });
    
    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    );
  }
}